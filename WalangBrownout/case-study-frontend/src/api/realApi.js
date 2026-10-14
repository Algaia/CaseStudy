// Real API client — replaces fakeApi.js. Talks to the Laravel backend.
// Set VITE_API_URL in your .env (e.g. http://127.0.0.1:8000/api locally,
// your Railway/Render URL in production).

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// --- Auth ---
export async function login(email, password) {
  const data = await request('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  localStorage.setItem('token', data.token);
  return data.user;
}

export function logout() {
  const promise = request('/logout', { method: 'POST' });
  localStorage.removeItem('token');
  return promise;
}

// --- Workspace (replaces fetchInventoryWorkspace) ---
export function fetchInventoryWorkspace() {
  return request('/workspace');
}

// --- Mutations ---
export function receiveStock(receipt) {
  return request('/receive', {
    method: 'POST',
    body: JSON.stringify({
      productId: receipt.product.id,
      quantity: receipt.quantity,
      lot: receipt.lot,
      received: receipt.received,
      expires: receipt.expires,
      location: receipt.location,
    }),
  });
}

export function completePick(taskId) {
  return request(`/picks/${taskId}/complete`, { method: 'POST' });
}

export function reportPickIssue(taskId) {
  return request(`/picks/${taskId}/report-issue`, { method: 'POST' });
}

export function createPurchaseOrder(recommendationId) {
  return request(`/reorder/${recommendationId}/create-po`, { method: 'POST' });
}

export function writeOffLot(lotId, reason) {
  return request(`/lots/${lotId}/writeoff`, { method: 'POST', body: JSON.stringify({ reason }) });
}

export function toggleAlertRead(alertId, markRead) {
  return request(`/alerts/${alertId}/read`, {
    method: 'PATCH',
    body: JSON.stringify(typeof markRead === 'boolean' ? { read: markRead } : {}),
  });
}

export function markAllRead() {
  return request('/alerts/read-all', { method: 'POST' });
}
