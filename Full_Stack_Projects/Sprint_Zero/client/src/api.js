// Thin fetch wrapper around the Lab Quest API. Every call matches docs/api-contract.md.
const BASE = 'http://localhost:3001';

export function getToken() { return localStorage.getItem('lq_token'); }
export function setToken(t) {
  if (t) localStorage.setItem('lq_token', t);
  else localStorage.removeItem('lq_token');
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong.');
    err.code = data.error;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  signup: (email, password) => request('/auth/signup', { method: 'POST', body: { email, password } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me'),
  experiments: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const s = qs.toString();
    return request('/experiments' + (s ? `?${s}` : ''));
  },
  experiment: (id) => request(`/experiments/${id}`),
  rate: (id, stars) => request(`/experiments/${id}/rating`, { method: 'PUT', body: { stars } }),
  unrate: (id) => request(`/experiments/${id}/rating`, { method: 'DELETE' }),
  saved: () => request('/saved'),
  save: (experiment_id) => request('/saved', { method: 'POST', body: { experiment_id } }),
  unsave: (id) => request(`/saved/${id}`, { method: 'DELETE' }),
};
