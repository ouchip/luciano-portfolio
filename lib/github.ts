export type ContributionDay = {date:string; count:number; level:number};
export function parseContributions(html:string):ContributionDay[]{
 const tips=new Map<string,number>();
 for(const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)){
  const id=match[1].match(/\bfor="([^"]+)"/)?.[1];
  const text=match[2].replace(/<[^>]*>/g,'').trim();
  if(id && /^(No|[\d,]+) contributions? on /.test(text))tips.set(id,text.startsWith('No')?0:Number(text.match(/^[\d,]+/)![0].replaceAll(',','')));
 }
 const days:ContributionDay[]=[];
 for(const match of html.matchAll(/<td\b[^>]*data-date="\d{4}-\d{2}-\d{2}"[^>]*>/g)){
  const attrs=Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
  const count=tips.get(attrs.id);const level=Number(attrs['data-level']);
  if(count===undefined||!Number.isInteger(level)||level<0||level>4)continue;
  days.push({date:attrs['data-date'],count,level});
 }
 const sorted=days.sort((a,b)=>a.date.localeCompare(b.date));
 if(sorted.length<350 || new Set(sorted.map(d=>d.date)).size!==sorted.length)throw new Error('GitHub calendar format changed');
 return sorted;
}
