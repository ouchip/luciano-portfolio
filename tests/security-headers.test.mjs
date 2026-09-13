import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare} from 'miniflare';
import {fileURLToPath} from 'node:url';
import {secureSiteResponse} from '../server/security-headers.ts';
test('public API responses carry transport, framing and MIME protections',async()=>{
 const r=secureSiteResponse(new Request('https://lucianopinilla.com/api/github'),Response.json({days:[]}));
 assert.equal(r.headers.get('X-Frame-Options'),'DENY');assert.equal(r.headers.get('X-Content-Type-Options'),'nosniff');assert(r.headers.get('Strict-Transport-Security'));assert.equal(r.headers.get('Referrer-Policy'),'strict-origin-when-cross-origin');assert.match(r.headers.get('Content-Security-Policy'),/object-src 'none'/);
});
test('campus protection preserves its existing scripts, forms and relative asset base',async()=>{
 const r=secureSiteResponse(new Request('https://lucianopinilla.com/campus/'),new Response('<base href="/campus/"><script>existing()</script>',{headers:{'Content-Type':'text/html'}}));
 assert.equal(await r.text(),'<base href="/campus/"><script>existing()</script>');assert.match(r.headers.get('Content-Security-Policy'),/base-uri 'self'/);assert.match(r.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);
});
test('rendered portfolio scripts and preloads receive fresh matching CSP nonces in workerd',async()=>{
 const {outputFiles}=await build({stdin:{contents:`import {secureSiteResponse} from './server/security-headers.ts';export default {fetch(request){return secureSiteResponse(request,new Response('<html><head><link rel="modulepreload" href="/assets/main.js"></head><body><script>window.ready=true</script><script src="/assets/main.js" type="module"></script></body></html>',{headers:{'Content-Type':'text/html','ETag':'old'}}))}}`,resolveDir:fileURLToPath(new URL('..',import.meta.url))},bundle:true,write:false,platform:'neutral',format:'esm',target:'es2022'});
 const mf=new Miniflare({workers:[{config:{name:'headers-test',type:'worker',compatibilityDate:'2026-09-01',manifest:{mainModule:'index.js',modules:{'index.js':{type:'esm',contents:outputFiles[0].text}}},env:{}}}]});
 try{const first=await mf.dispatchFetch('https://site.test/'),html=await first.text(),nonce=first.headers.get('Content-Security-Policy').match(/'nonce-([^']+)'/)[1];assert(nonce.length>=24);assert.match(first.headers.get('Content-Security-Policy'),/'strict-dynamic'/);assert(!first.headers.get('Content-Security-Policy').includes("script-src 'unsafe-inline'"));assert.equal(first.headers.get('ETag'),null);assert.equal([...html.matchAll(/nonce="([^"]+)"/g)].length,3);assert([...html.matchAll(/nonce="([^"]+)"/g)].every(m=>m[1]===nonce));const next=await mf.dispatchFetch('https://site.test/');assert.notEqual(next.headers.get('Content-Security-Policy'),first.headers.get('Content-Security-Policy'))}finally{await mf.dispose()}
});
