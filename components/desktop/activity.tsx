'use client';
import {useEffect,useState} from 'react';
import type {ContributionDay} from '@/lib/github';
type ActivityData={days:ContributionDay[];total:number;fetchedAt:string};
export default function Activity(){
 const [data,setData]=useState<ActivityData|null>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{const controller=new AbortController();const load=async()=>{try{const r=await fetch('/api/github',{signal:controller.signal});if(!r.ok)throw new Error();const d:ActivityData=await r.json();setData(d);setError(false)}catch{if(!controller.signal.aborted)setError(true)}};load();const interval=setInterval(load,900000);return()=>{controller.abort();clearInterval(interval)}},[retry]);
 if(!data)return <div className="activity-loading" role="status">{error?<span>GitHub is taking a moment. <button onClick={()=>{setError(false);setRetry(n=>n+1)}}>Try again ↻</button></span>:'Loading GitHub activity…'}</div>;
 const recent=data.days.slice(-182);
 const start=new Date(recent[0].date+'T12:00:00Z').getUTCDay();
 const active=data.days.filter(d=>d.count>0).length;
 return <><div className="contribution-summary"><strong>{data.total} contributions</strong><span>Past year · {active} active {active===1?'day':'days'}</span></div><div className="calendar-scroll"><div className="contribution-grid" role="img" aria-label={`${data.total} contributions in the past year. Calendar shows the latest six months.`}>{Array.from({length:start},(_,i)=><span key={'pad'+i}/>)}{recent.map(d=><span key={d.date} data-level={d.level} aria-hidden="true"/>)}</div></div><div className="calendar-legend"><span>{new Date(recent[0].date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',timeZone:'UTC'})} — {new Date(recent.at(-1)!.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',year:'numeric',timeZone:'UTC'})}</span><span>Less <i data-level="0"/><i data-level="1"/><i data-level="2"/><i data-level="3"/><i data-level="4"/> More</span></div><p className="data-status">{error?'Last available update · ': 'Updated '}{new Date(data.fetchedAt).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})} · GitHub can take time to reflect new commits.</p></>
}
