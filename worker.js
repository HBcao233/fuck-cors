/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */

export default {
  /**
   * This is the standard fetch handler for a Cloudflare Worker
   *
   * @param request - The request submitted to the Worker from the client
   * @param env - The interface to reference bindings declared in wrangler.jsonc
   * @param ctx - The execution context of the Worker
   * @returns The response to be sent back to the client
   */
  async fetch(request, env, ctx) {
    if (request.method == 'OPTIONS') {
      return this.setHeaders(request, new Response(null, { status: 204 }));
    }
    
    let url = new URL(request.url);
    let searchParams = url.searchParams;
    const _headers = request.headers;
    const upstream_host = _headers.get('upstream-host') || searchParams.get('upstream_host');
    if (!upstream_host) {
      return this.homePage(request);
    }
    
    const arr = ['x-forwarded-proto', 'x-real-ip', 'upgrade-insecure-requests', 'upstream-host', 'real-referer', 'real-origin'];
    let headers = new Headers();
    for (let k of _headers.keys()) {
      k = k.toLowerCase();
      if (arr.includes(k)) continue;
      if (k.startsWith('sec-')) continue;
      if (k.startsWith('cf-')) continue;
      headers.set(k, _headers.get(k));
    }
    const real_origin = _headers.get('real-origin') || searchParams.get('real_origin');
    const real_referer = _headers.get('real-referer') || searchParams.get('real_referer');
    if (real_origin) headers.set('origin', real_origin);
    if (real_referer) headers.set('referer', real_referer);
    
    url.host = upstream_host;
    url.searchParams.delete('upstream_host');
    url.searchParams.delete('real_origin');
    url.searchParams.delete('real_referer');
    const r = await fetch(url, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'manual',
    });
    let res = new Response(r.body, r);
    return this.setHeaders(request, res);
  },
  
  setHeaders(request, res) {
    const origin = request.headers.get('origin') || '*';
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', '*');
    res.headers.set('Access-Control-Allow-Headers', '*');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Access-Control-Max-Age', '86400');
    
    if (res.headers.get('location')) {
      let u = new URL(res.headers.get('location'));
      const host = u.host;
      u.host = new URL(request.url).host;
      u.searchParams.set('upstream_host', host);
      res.headers.set('location', u.toString());
    }
    
    // 设置 Set-Header-<HeaderName> 
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams,
      ...request.headers,
    ]);
    for (const [k, v] of Object.entries(params)) {
      const match = k.match(/^[sS][eE][tT][-_][hH][eE][aA][dD][eE][rR][-_]([0-9a-zA-Z-_]+)$/);
      if (match) {
        res.headers.set(match[1], v);
      }
    }
    return res;
  },
  
  homePage(request) {
    let res = new Response('<html><head><title>Fuck CORS</title></head><body>Hello World!</body></html>', {
      headers: {
        'Content-Type': 'text/html',
      },
    })
    return this.setHeaders(request, res);
  },
}