// src/services/api.js
const RAW = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');
export const API_BASE = RAW; // export for debugging or other libs

// Optional: pull token from localStorage (once auth is wired)
function authHeader() {
  const token = localStorage.getItem('mct_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, { params, body } = {}) {
  const qs = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.append(k, String(v));
    });
  }
  const url = `${API_BASE}${path}${qs.size ? `?${qs}` : ''}`;

  // 10s timeout
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(t);
  }

  let payload;
  try { payload = await res.json(); }
  catch { payload = { error: await res.text().catch(() => 'Unknown error') }; }

  if (!res.ok) {
    const msg = payload?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return payload;
}

const get  = (path, params)        => request('GET', path, { params });
const post = (path, body)          => request('POST', path, { body });
const put  = (path, body)          => request('PUT', path, { body });
const del  = (path, params)        => request('DELETE', path, { params });

export const fetchSongs  = (opts) => get('/songs', opts).then(r => r.data);
export const rateSong    = (userId, songId, ratingValue) => post('/ratings', { userId, songId, ratingValue });

export const fetchGenres = () => get('/meta/genres').then(r => r.data);
export const fetchMoods  = () => get('/meta/moods').then(r => r.data);
export const fetchActs   = () => get('/meta/activities').then(r => r.data);

export const getContext  = (userId) => get(`/meta/context/${userId}`).then(r => r.data);
export const setContext  = (userId, moodCode, activityId) => put(`/meta/context/${userId}`, { moodCode, activityId });

export const fetchRecs   = (userId, limit = 20) => get(`/recs/${userId}`, { limit }).then(r => r.data);

// Export lower-level helpers in case you need custom calls later
export const http = { get, post, put, del };
