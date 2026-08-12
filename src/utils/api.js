export const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:8000'
  : '';

export async function apiFetch(endpoint, options = {}) {
  // If we are on public static deployment (e.g. GitHub Pages) and backend is local,
  // return a synthetic 503 response so callers handle fallback cleanly without console errors.
  if (!API_BASE && !endpoint.startsWith('https://')) {
    console.info('Static hosting mode: using local fallback data');
    return new Response(JSON.stringify({ detail: 'Static hosting mode: using local fallback' }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const customOptions = {
    ...options,
    targetAddressSpace: (url.includes('localhost') || url.includes('127.0.0.1')) ? 'local' : undefined
  };

  try {
    return await fetch(url, customOptions);
  } catch (err) {
    console.info('Network fetch unavailable, using local client fallback');
    return new Response(JSON.stringify({ detail: err.message }), {
      status: 503,
      statusText: 'Network Error',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
