export const CAMPUS_ORIGIN='https://fomo-campus-wars-luchi.luciano589188.chatgpt.site';
const legacyOrigins=[CAMPUS_ORIGIN,'https://lucianopinilla.com'];

// Keep the maintained Fomo deployment authoritative; media remains streamed.
export function rewriteCampusText(text:string,publicOrigin:string){
  let output=text.replace(/https:\/\/(?:fomo-campus-wars-luchi\.luciano589188\.chatgpt\.site|lucianopinilla\.com)(?=[/"'\s<>]|$)/g,publicOrigin+'/campus');
  output=output.replace(/(\b(?:href|src|poster|action)\s*=\s*["'])\/(?!\/|campus(?:\/|["']))/gi,'$1/campus/');
  output=output.replace(/(["'`])\/(api|assets|fonts|icons|internship|creators|register|campus-wars)(?=[/?.#"'`])/g,'$1/campus/$2');
  output=output.replace(/(url\(\s*["']?)\/(?!\/|campus\/)/g,'$1/campus/');
  return output;
}
export function upstreamUrl(requestUrl:string){
  const request=new URL(requestUrl),upstream=new URL(CAMPUS_ORIGIN);
  upstream.pathname=request.pathname.replace(/^\/campus(?=\/|$)/,'')||'/';
  if(upstream.pathname.startsWith('/api/'))upstream.pathname=upstream.pathname.replace(/\/$/,'');
  if(/^\/campus-wars(?:\.html)?\/?$/.test(upstream.pathname))upstream.pathname='/campus-wars.html';
  upstream.search=request.search;
  return upstream;
}
export async function campusResponse(request:Request,fetcher:typeof fetch=fetch){
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  const url=new URL(request.url);
  if(url.pathname==='/campus')return Response.redirect(url.origin+'/campus/'+url.search,308);
  const target=upstreamUrl(request.url),headers=new Headers();
  for(const key of ['Accept','Range','If-None-Match','If-Modified-Since']){const value=request.headers.get(key);if(value)headers.set(key,value)}
  let result=await fetcher(target,{method:request.method,headers,redirect:'manual'});
  if(target.pathname==='/campus-wars.html'&&result.status>=300&&result.status<400){const redirected=new URL(result.headers.get('Location')||'',target);if(redirected.origin===CAMPUS_ORIGIN)result=await fetcher(redirected,{method:request.method,headers,redirect:'manual'})}
  const responseHeaders=new Headers();
  for(const key of ['Content-Type','Cache-Control','ETag','Last-Modified','Content-Range','Accept-Ranges']){const value=result.headers.get(key);if(value)responseHeaders.set(key,value)}
  responseHeaders.set('X-Content-Type-Options','nosniff');
  const location=result.headers.get('Location');
  if(location){const dest=new URL(location,target);responseHeaders.set('Location',legacyOrigins.includes(dest.origin)?url.origin+'/campus'+dest.pathname+dest.search+dest.hash:dest.href)}
  const type=result.headers.get('Content-Type')||'';
  const rewrite=/text\/html|text\/css|(?:application|text)\/javascript/.test(type)&&result.status===200;
  if(request.method==='HEAD'||[204,304].includes(result.status))return new Response(null,{status:result.status,headers:responseHeaders});
  if(rewrite){
    responseHeaders.delete('ETag');
    let text=rewriteCampusText(await result.text(),url.origin);
    if(type.includes('text/html')){
      // Clean URLs must retain the source document's directory for relative assets.
      const directory=target.pathname.slice(0,target.pathname.lastIndexOf('/')+1);
      const base=url.origin+'/campus'+directory;
      if(!/<base\b/i.test(text))text=text.replace(/<head(?:\s[^>]*)?>/i,match=>match+'<base href="'+base+'">');
    }
    return new Response(text,{status:result.status,headers:responseHeaders});
  }
  return new Response(result.body,{status:result.status,headers:responseHeaders});
}
