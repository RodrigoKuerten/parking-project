// Proxies /api/* from Cloudflare Pages to the Render backend.
// Origin is dropped so the backend treats the call as same-origin (no CORS check).
const BACKEND = "https://patio-api-zljm.onrender.com";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const headers = new Headers(context.request.headers);
  headers.delete("Origin");
  headers.delete("Host");
  return fetch(BACKEND + url.pathname + url.search, {
    method: context.request.method,
    headers,
    body: ["GET", "HEAD"].includes(context.request.method) ? undefined : context.request.body,
    redirect: "manual",
  });
}
