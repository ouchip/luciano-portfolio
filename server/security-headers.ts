export function secureSiteResponse(request:Request,response:Response){
  const headers=new Headers(response.headers),path=new URL(request.url).pathname;
  headers.set('Strict-Transport-Security','max-age=31536000');
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('X-Frame-Options','DENY');
  headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  headers.set('Cross-Origin-Opener-Policy','same-origin');
  // The maintained campus site has its own scripts and forms; preserve those flows.
  const campus=path==='/campus'||path.startsWith('/campus/');
  if(campus){
    headers.set('Content-Security-Policy',"base-uri 'self'; object-src 'none'; frame-ancestors 'none'");
    return new Response(response.body,{status:response.status,headers});
  }
  const nonce=btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(18))));
  headers.set('Content-Security-Policy',`default-src 'self'; script-src 'nonce-${nonce}' 'strict-dynamic' 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`);
  const html=(headers.get('Content-Type')||'').includes('text/html')&&request.method!=='HEAD';
  if(html){headers.delete('Content-Length');headers.delete('ETag')}
  const secured=new Response(response.body,{status:response.status,headers});
  return html?new HTMLRewriter().on('script, link[rel="modulepreload"], link[as="script"]',{element(element){element.setAttribute('nonce',nonce)}}).transform(secured):secured;
}
