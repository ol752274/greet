const BASE = '/api';

function getToken() {
  return localStorage.getItem('wc_token');
}

async function req(method, path, body, isForm = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  // Auth
  register: (email, password, name) => req('POST', '/auth/register', { email, password, name }),
  login: (email, password) => req('POST', '/auth/login', { email, password }),
  guest: () => req('POST', '/auth/guest'),
  googleAuth: (googleUser) => req('POST', '/auth/google', googleUser),
  me: () => req('GET', '/auth/me'),

  // User
  updateProfile: (formData) => req('PUT', '/user/profile', formData, true),
  subscribe: (planId) => req('POST', '/user/subscribe', { planId }),

  // Templates
  getTemplates: (cat) => req('GET', `/templates${cat && cat !== 'All' ? `?cat=${cat}` : ''}`),
};
