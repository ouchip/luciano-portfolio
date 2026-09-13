import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CAMPUS_ORIGIN,upstreamUrl,rewriteCampusText,campusResponse} from '../lib/campus-proxy.ts';
test('campus requests always use the fixed Fomo origin',()=>{
  for(const path of ['/campus/','/campus/internship/','/campus//evil.example/','/campus/assets/hero.mp4'])assert.equal(upstreamUrl('https://lucianopinilla.com'+path).origin,CAMPUS_ORIGIN);
  assert.equal(upstreamUrl('https://lucianopinilla.com/campus/api/campuswars?a=1').href,CAMPUS_ORIGIN+'/api/campuswars?a=1');
});
test('Fomo links, scripts and media stay under campus; external links remain external',()=>{
  const text='<a href="/internship/">Internship</a><img src="../assets/logo.svg"><script>fetch("/api/campuswars"); let video="/assets/hero.mp4"</script><a href="https://milomessina.com/fomo/campuswars/">Village</a>';
  const rewritten=rewriteCampusText(text,'https://lucianopinilla.com');assert.match(rewritten,/href="\/campus\/internship\//);assert.match(rewritten,/fetch\("\/campus\/api\/campuswars"\)/);assert.match(rewritten,/src="\.\.\/assets\/logo.svg"/);assert.match(rewritten,/https:\/\/milomessina.com\/fomo\/campuswars\//);assert(!rewritten.includes('/campus/campus/'));
  assert.equal(rewriteCampusText(CAMPUS_ORIGIN+'/internship/','https://lucianopinilla.com'),'https://lucianopinilla.com/campus/internship/');
});
test('the campus proxy never forwards portfolio cookies or credentials',async()=>{
  let seen;const response=await campusResponse(new Request('https://lucianopinilla.com/campus/assets/hero.mp4',{headers:{Cookie:'private=secret',Authorization:'Bearer secret',Range:'bytes=0-10'}}),async(url,init)=>{seen={url,init};return new Response('media',{status:206,headers:{'Content-Type':'video/mp4','Content-Range':'bytes 0-4/5','Set-Cookie':'upstream=secret'}})});
  assert.equal(seen.init.headers.get('Cookie'),null);assert.equal(seen.init.headers.get('Authorization'),null);assert.equal(seen.init.headers.get('Range'),'bytes=0-10');assert.equal(response.headers.get('Set-Cookie'),null);assert.equal(response.status,206);assert.equal(await response.text(),'media');
});
