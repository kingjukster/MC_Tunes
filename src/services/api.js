const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const get = async (path, params={}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => v !== undefined && qs.append(k, String(v)));
  const res = await fetch(`${API}${path}${qs.toString() ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const post = async (path, body) => {
  const res = await fetch(`${API}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const put = async (path, body) => {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const fetchSongs = (opts) => get('/songs', opts).then(r => r.data);
export const rateSong   = (userId, songId, ratingValue) => post('/ratings', { userId, songId, ratingValue });

export const fetchGenres = () => get('/meta/genres').then(r => r.data);
export const fetchMoods  = () => get('/meta/moods').then(r => r.data);
export const fetchActs   = () => get('/meta/activities').then(r => r.data);

export const getContext  = (userId) => get(`/meta/context/${userId}`).then(r => r.data);
export const setContext  = (userId, moodCode, activityId) => put(`/meta/context/${userId}`, { moodCode, activityId });

export const fetchRecs   = (userId, limit=20) => get(`/recs/${userId}`, { limit }).then(r => r.data);
