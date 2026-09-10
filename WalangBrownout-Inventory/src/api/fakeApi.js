// A simulated "fake REST API" for the midterm frontend-only scope.
//
// Real projects would call `fetch('/api/products')` against a server such as
// Laravel (Module 2, next term) or a mock server like json-server. For now we
// deep-clone the seed data from `data.js` and return it from a function that
// behaves exactly like a real network call: it's asynchronous, it can be
// slow, and it can fail — so every consumer still has to handle loading and
// error states the same way it would for a real endpoint.
//
// Trigger a failed request on purpose (to demo the error path) by loading
// the app with ?apiError=1 in the URL.

import {
  initialActivity,
  initialAlerts,
  initialLots,
  initialProducts,
  initialWriteoffs,
  pickTasks,
  reorderRecommendations,
} from '../data';

const NETWORK_DELAY_MS = 650;

function shouldSimulateError() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('apiError') === '1';
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Simulates `fetch('/api/inventory').then((res) => res.json())`.
 * Resolves with every collection the app needs on first load, or rejects
 * with an Error the same way a failed `fetch` would.
 */
export function fetchInventoryWorkspace() {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldSimulateError()) {
        reject(new Error('Could not reach the inventory service. Please try again.'));
        return;
      }
      resolve({
        products: clone(initialProducts),
        lots: clone(initialLots),
        alerts: clone(initialAlerts),
        activity: clone(initialActivity),
        tasks: clone(pickTasks),
        recommendations: clone(reorderRecommendations),
        writeoffs: clone(initialWriteoffs),
      });
    }, NETWORK_DELAY_MS);
  });
}
