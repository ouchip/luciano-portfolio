'use client';
import {useState, useEffect, type ReactNode} from 'react';
import {ArrowUpRight, Folder, GitBranch, MessageCircle, Minus, Maximize2, X} from 'lucide-react';
import Activity from '@/components/desktop/activity';
import MacOSDock from '@/components/desktop/mac-os-dock';
import {Menubar,MenubarMenu,MenubarTrigger,MenubarContent,MenubarItem} from '@/components/ui/menubar';

type AppId='work'|'about'|'activity'|'contact';
const apps=[
 {id:'work',name:'Selected work',icon:'/icons/finder.png'},
 {id:'about',name:'About Luciano',icon:'/icons/notes.png'},
 {id:'activity',name:'GitHub activity',icon:'/icons/terminal.webp'},
 {id:'contact',name:'Get in touch',icon:'/icons/mail.png'},
];
const names:Record<AppId,string>={work:'Selected work',about:'About Luciano',activity:'GitHub activity',contact:'Get in touch'};
function Out({href,children,className=''}:{href:string;children:ReactNode;className?:string}){return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={16}/></a>}
type WindowProps={id:AppId;children:ReactNode;open:AppId[];front:AppId;expanded:AppId|null;setFront:(id:AppId)=>void;setOpen:React.Dispatch<React.SetStateAction<AppId[]>>;setExpanded:(id:AppId|null)=>void};
 function Window({id,children,open,front,expanded,setFront,setOpen,setExpanded}:WindowProps){return open.includes(id)?<section id={id} aria-label={names[id]} className={`window window-${id} ${front===id?'focused':''} ${expanded===id?'expanded':''}`} onPointerDown={()=>setFront(id)} style={{zIndex:front===id?5:2}}><header className="titlebar"><div className="traffic"><button aria-label={`Close ${names[id]}`} className="close" onClick={()=>{setOpen(v=>v.filter(a=>a!==id));setExpanded(null)}}><X/></button><button aria-label={`Minimize ${names[id]}`} className="minimize" onClick={()=>setOpen(v=>v.filter(a=>a!==id))}><Minus/></button><button aria-label={`${expanded===id?'Restore':'Expand'} ${names[id]}`} className="maximize" onClick={()=>setExpanded(expanded===id?null:id)}><Maximize2/></button></div><span>{names[id]}</span><span className="window-symbol">{id==='work'?<Folder size={15}/>:id==='activity'?<GitBranch size={15}/>:null}</span></header>{children}</section>:null}
export default function Home(){
 const [open,setOpen]=useState<AppId[]>(['work','about','activity']);
 const [front,setFront]=useState<AppId>('work');
 const [expanded,setExpanded]=useState<AppId|null>(null);
 const [time,setTime]=useState('');
 function show(id:AppId){setOpen(v=>v.includes(id)?v:[...v,id]);setFront(id);if(window.innerWidth<800)requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}));}
 useEffect(()=>{const tick=()=>setTime(new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}));tick();const id=setInterval(tick,30000);return()=>clearInterval(id)},[]);

 return <main className="desktop"><div className="wallpaper"/><header className="topbar"><button className="monogram" aria-label="Restore desktop" onClick={()=>{setOpen(['work','about','activity']);setExpanded(null)}}>lp.</button><Menubar className="desktop-menu"><MenubarMenu><MenubarTrigger className="app-name">Luciano Pinilla</MenubarTrigger><MenubarContent><MenubarItem onClick={()=>show('about')}>About Luciano</MenubarItem><MenubarItem onClick={()=>show('contact')}>Get in touch</MenubarItem></MenubarContent></MenubarMenu><MenubarMenu><MenubarTrigger>Work</MenubarTrigger><MenubarContent><MenubarItem onClick={()=>show('work')}>Fomo Campus</MenubarItem><MenubarItem onClick={()=>show('activity')}>GitHub activity</MenubarItem></MenubarContent></MenubarMenu><MenubarMenu><MenubarTrigger>Window</MenubarTrigger><MenubarContent>{apps.map(a=><MenubarItem key={a.id} onClick={()=>show(a.id as AppId)}>{a.name}</MenubarItem>)}<MenubarItem onClick={()=>{setOpen([]);setExpanded(null)}}>Show desktop</MenubarItem></MenubarContent></MenubarMenu></Menubar><div className="menu-status"><span><i/> Building things</span><time>{time}</time></div></header>
 <div className="desktop-heading"><p>A few things I’m working on.</p><h1>luciano<br/>pinilla</h1><div className="identity-links"><a href="https://x.com/foezart" target="_blank" rel="noopener noreferrer">@foezart ↗</a><span>Independent work, ongoing.</span></div></div>
 <div className="workspace">
 <Window open={open} front={front} expanded={expanded} setFront={setFront} setOpen={setOpen} setExpanded={setExpanded} id="work"><div className="work-toolbar"><span><span className="tiny-folder">▰</span> Projects / Fomo Campus</span><span>01</span></div><a href="https://fomo-campus-wars-luchi.luciano589188.chatgpt.site/" target="_blank" rel="noopener noreferrer" className="project-image"><img src="/images/fomo-village.jpg" alt="The Greek village from the Fomo Campus website"/><span className="project-image-label">fomo<span>campus</span></span><span className="image-arrow"><ArrowUpRight size={24}/></span></a><div className="project-copy"><div className="eyebrow">FEATURED PROJECT · 2026</div><h2>From a campus idea<br/>to a working website.</h2><p>The Fomo Campus experience: Greek Wars, chapter registration, and a village you can fly into.</p><div className="project-bottom"><span className="project-tags">Web design <b>·</b> Development</span><Out href="https://github.com/ouchip/fomo-campus">View source</Out></div></div></Window>
 <Window open={open} front={front} expanded={expanded} setFront={setFront} setOpen={setOpen} setExpanded={setExpanded} id="about"><div className="note-toolbar"><span>All notes</span><span>1 note</span></div><div className="note-body"><p className="note-date">A little introduction</p><h2>Hey, I’m Luciano.</h2><p>I like turning ideas into things you can actually use.</p><p>Right now, that means building Fomo Campus—and making this corner of the internet my own.</p><button className="handwritten" onClick={()=>show('contact')}>Let’s make something. <ArrowUpRight size={20}/></button></div></Window>
 <Window open={open} front={front} expanded={expanded} setFront={setFront} setOpen={setOpen} setExpanded={setExpanded} id="activity"><div className="activity-body"><div className="activity-heading"><div><span className="eyebrow">BUILDING IN PUBLIC</span><h2>A little more green.</h2></div><GitBranch size={26}/></div><Activity/><Out className="activity-link" href="https://github.com/ouchip">github.com/ouchip</Out></div></Window>
 <Window open={open} front={front} expanded={expanded} setFront={setFront} setOpen={setOpen} setExpanded={setExpanded} id="contact"><div className="contact-body"><MessageCircle size={32}/><span className="eyebrow">GET IN TOUCH</span><h2>Good things start<br/>with a conversation.</h2><p>Find me on X. See what I’m building on GitHub.</p><Out className="contact-link" href="https://x.com/foezart">@foezart</Out><Out className="contact-link secondary-link" href="https://github.com/ouchip">GitHub / ouchip</Out></div></Window>
 </div><footer className="dock-wrap" aria-label="Desktop apps"><MacOSDock apps={apps} openApps={open} onAppClick={id=>show(id as AppId)}/></footer><span className="desktop-footnote">Luciano Pinilla · Selected work</span></main>
}

