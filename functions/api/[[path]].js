// Proxies /api/* from Cloudflare Pages to the Render backend (same-origin for the browser).
const BACKEND = "https://patio-api-zljm.onrender.com";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  return fetch(BACKEND + url.pathname + url.search, context.request);
}
