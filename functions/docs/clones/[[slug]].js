// Serve the clone-docs SPA at /docs/clones/:id without a pretty-URL 308
// that would strip the slug (Pages canonicalizes /docs/clone.html → /docs/clone).
export async function onRequest(context) {
  const origin = new URL(context.request.url).origin;
  const asset = await fetch(new URL("/docs/clone.html", origin));
  const html = await asset.text();
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
