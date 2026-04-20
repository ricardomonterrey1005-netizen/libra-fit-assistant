// ================================================================
//  LIBRA FIT - Supabase Storage Adapter
// ================================================================
//  Sincroniza los archivos encriptados (users.json, database.json,
//  audit.json) con Supabase Storage para persistencia real.
//
//  Necesario porque Render Free tier tiene disco efimero:
//  cada restart borra los datos locales.
//
//  Configuracion (env vars):
//   - SUPABASE_URL           https://XXXXX.supabase.co
//   - SUPABASE_SERVICE_KEY   eyJhbGci... (service_role key, NO anon)
//   - SUPABASE_BUCKET        'librafit-data' (default)
//
//  Uso:
//   const storage = require('./storage-supabase');
//   await storage.download('users.json');     // Al arrancar
//   await storage.upload('users.json', data); // Al guardar
//
//  Si no hay env vars, isEnabled() devuelve false y db.js usa solo disco.
// ================================================================

const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const BUCKET = process.env.SUPABASE_BUCKET || 'librafit-data';

function isEnabled() {
  return !!(SUPABASE_URL && SUPABASE_KEY);
}

// ===== HTTPS request helper =====
function request(opts, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(opts.url);
    const options = {
      hostname: url.hostname,
      path: url.pathname + (url.search || ''),
      method: opts.method || 'GET',
      headers: opts.headers || {}
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: buffer,
          text: buffer.toString('utf8')
        });
      });
    });
    req.on('error', reject);
    if(body) req.write(body);
    req.end();
  });
}

// ===== Ensure bucket exists (crear si no) =====
async function ensureBucket() {
  if(!isEnabled()) return false;
  try {
    const res = await request({
      url: `${SUPABASE_URL}/storage/v1/bucket`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      }
    }, JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: false,
      file_size_limit: 10 * 1024 * 1024  // 10MB
    }));
    // 200 (created), 409 (already exists), both OK
    return res.statusCode === 200 || res.statusCode === 409;
  } catch(e) {
    console.warn('[Supabase] ensureBucket failed:', e.message);
    return false;
  }
}

// ===== Descargar archivo =====
async function download(filename) {
  if(!isEnabled()) return null;
  try {
    const res = await request({
      url: `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY
      }
    });
    if(res.statusCode === 200) {
      console.log(`[Supabase] Downloaded ${filename} (${res.body.length} bytes)`);
      return res.text;
    }
    if(res.statusCode === 404) {
      console.log(`[Supabase] ${filename} not found (first run?)`);
      return null;
    }
    console.warn(`[Supabase] download ${filename} status ${res.statusCode}`);
    return null;
  } catch(e) {
    console.warn(`[Supabase] download ${filename} failed:`, e.message);
    return null;
  }
}

// ===== Subir archivo (upsert) =====
async function upload(filename, content) {
  if(!isEnabled()) return false;
  try {
    // Use POST + x-upsert: true para crear o reemplazar
    const res = await request({
      url: `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'text/plain; charset=utf-8',
        'apikey': SUPABASE_KEY,
        'x-upsert': 'true',
        'Cache-Control': 'no-cache'
      }
    }, content);

    // 200 OK (upsert update), 409 conflict (no usa upsert pero existe)
    if(res.statusCode === 200 || res.statusCode === 201) {
      return true;
    }
    // Intentar PUT si POST falla
    const res2 = await request({
      url: `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'text/plain; charset=utf-8',
        'apikey': SUPABASE_KEY,
        'Cache-Control': 'no-cache'
      }
    }, content);
    if(res2.statusCode === 200 || res2.statusCode === 201) return true;

    console.warn(`[Supabase] upload ${filename} status ${res.statusCode}/${res2.statusCode}`);
    return false;
  } catch(e) {
    console.warn(`[Supabase] upload ${filename} failed:`, e.message);
    return false;
  }
}

// ===== Listar archivos en el bucket =====
async function list() {
  if(!isEnabled()) return [];
  try {
    const res = await request({
      url: `${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      }
    }, JSON.stringify({ limit: 100, offset: 0, prefix: '' }));
    if(res.statusCode === 200) {
      return JSON.parse(res.text);
    }
  } catch(e) {
    console.warn('[Supabase] list failed:', e.message);
  }
  return [];
}

// ===== Borrar archivo =====
async function remove(filename) {
  if(!isEnabled()) return false;
  try {
    const res = await request({
      url: `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY
      }
    });
    return res.statusCode === 200;
  } catch(e) {
    return false;
  }
}

module.exports = {
  isEnabled,
  ensureBucket,
  download,
  upload,
  list,
  remove,
  BUCKET,
  URL: SUPABASE_URL
};
