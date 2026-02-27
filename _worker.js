export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy /mdcovers/* → uploads.mangadex.org/covers/* with spoofed Referer
    if (url.pathname.startsWith('/mdcovers/')) {
      const coverPath = url.pathname.slice('/mdcovers/'.length);
      const target = `https://uploads.mangadex.org/covers/${coverPath}`;
      const response = await fetch(target, {
        headers: {
          'Referer': 'https://mangadex.org/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const headers = new Headers(response.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Cache-Control', 'public, max-age=86400');
      return new Response(response.body, { status: response.status, headers });
    }

    // Everything else → serve the static site normally
    return env.ASSETS.fetch(request);
  }
};
