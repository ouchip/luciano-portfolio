import {parseContributions} from '@/lib/github';
export async function GET(){
 try{
  const response=await fetch('https://github.com/users/ouchip/contributions',{headers:{'User-Agent':'LucianoPortfolio/1.0','Accept':'text/html'},signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error('GitHub unavailable');
  const days=parseContributions(await response.text());
  return Response.json({days,total:days.reduce((n,d)=>n+d.count,0),fetchedAt:new Date().toISOString()},{headers:{'Cache-Control':'public, max-age=900, s-maxage=900'}});
 }catch{return Response.json({error:'GitHub activity is temporarily unavailable.'},{status:503,headers:{'Cache-Control':'no-store'}})}
}
