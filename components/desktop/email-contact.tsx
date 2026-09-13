'use client';
import {useEffect,useState,useRef} from 'react';
import {Copy,Check,Mail} from 'lucide-react';
export default function EmailContact({email}:{email:string}){
 const [state,setState]=useState<'idle'|'copied'|'manual'>('idle');const input=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(state==='idle')return;const id=setTimeout(()=>setState('idle'),4000);return()=>clearTimeout(id)},[state]);
 async function copy(){try{await navigator.clipboard.writeText(email);setState('copied')}catch{input.current?.focus();input.current?.select();setState('manual')}}
 return <div className="email-contact"><div className="email-row"><a href={`mailto:${email}`} aria-label={`Email ${email}`} title="Open email app"><Mail size={17}/></a><input ref={input} readOnly value={email} aria-label="Email address"/><button onClick={copy} aria-label={state==='copied'?'Email copied':'Copy email address'} title="Copy email">{state==='copied'?<Check size={16}/>:<Copy size={16}/>}</button></div><span className="copy-status" role="status">{state==='copied'?'Email copied.':state==='manual'?'Address selected. Copy it with your keyboard.':''}</span></div>
}
