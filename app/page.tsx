'use client';
import {useState, useEffect, type ReactNode} from 'react';
import {ArrowUpRight, Command, Folder, GitBranch, ExternalLink, Minus, Maximize2, X} from 'lucide-react';
import EmailContact from '@/components/desktop/email-contact';
import Activity from '@/components/desktop/activity';
import MacOSDock from '@/components/desktop/mac-os-dock';
import {Menubar,MenubarMenu,MenubarTrigger,MenubarContent,MenubarItem} from '@/components/ui/menubar';

type AppId='work'|'activity'|'contact';
const apps=[
 {id:'work',name:'Selected work',icon:'/icons/fomo-app.svg'},
 {id:'activity',name:'GitHub activity',icon:'/icons/github-app.svg'},
 {id:'contact',name:'Get in touch',icon:'/icons/mail.png'},
];
const names:Record<AppId,string>={work:'Selected work',activity:'GitHub activity',contact:'Get in touch'};
function Out({href,children,className=''}:{href:string;children:ReactNode;className?:string}){return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={16}/></a>}
type WindowProps={id:AppId;children:ReactNode;open:AppId[];front:AppId;expanded:AppId|null;setFront:(id:AppId)=>void;setOpen:React.Dispatch<React.SetStateAction<AppId[]>>;setExpanded:(id:AppId|null)=>void};
 function Window({id,children,open,front,expanded,setFront,setOpen,setExpanded}:WindowProps){return open.includes(id)?<section id={id} aria-label={names[id]} className={`window window-${id} ${front===id?'focused':''} ${expanded===id?'expanded':''}`} onPointerDown={()=>setFront(id)} style={{zIndex:front===id?5:2}}><header className="titlebar"><div className="traffic"><button aria-label={`Close ${names[id]}`} className="close" onClick={()=>{setOpen(v=>v.filter(a=>a!==id));setExpanded(null)}}><X/></button><button aria-label={`Minimize ${names[id]}`} className="minimize" onClick={()=>setOpen(v=>v.filter(a=>a!==id))}><Minus/></button><button aria-label={`${expanded===id?'Restore':'Expand'} ${names[id]}`} className="maximize" onClick={()=>setExpanded(expanded===id?null:id)}><Maximize2/></button></div><div className="window-title"><strong><img className={id==='work'?'brand-icon fomo-eyes':'brand-icon github-mark'} src={id==='work'?'/icons/fomo-eyes.svg':id==='activity'?'/icons/github.svg':'/icons/mail.png'} alt=""/>{names[id]}</strong><span>{id==='work'?'Fomo Campus':id==='activity'?'ouchip':'@foezart'}</span></div><div className="window-actions"><button aria-label={`${expanded===id?'Restore':'Expand'} ${names[id]} window`} title="Expand window" onClick={()=>setExpanded(expanded===id?null:id)}><Maximize2 size={16}/></button><a href={id==='work'?'https://fomo-campus-wars-luchi.luciano589188.chatgpt.site/':id==='activity'?'https://github.com/ouchip':'https://x.com/foezart'} target="_blank" rel="noopener noreferrer" aria-label={`Open ${names[id]} in a new tab`} title="Open in new tab"><ExternalLink size={16}/></a></div></header>{children}</section>:null}
export default function Home(){
 const [open,setOpen]=useState<AppId[]>(['work','activity','contact']);
 const [front,setFront]=useState<AppId>('work');
 const [expanded,setExpanded]=useState<AppId|null>(null);
 function show(id:AppId){setOpen(v=>v.includes(id)?v:[...v,id]);setFront(id);}


 return <main className="desktop"><div className="wallpaper"/><header className="topbar"><button className="monogram" aria-label="Restore desktop" onClick={()=>{setOpen(['work','activity','contact']);setExpanded(null)}}><Command size={17}/></button><Menubar className="desktop-menu"><MenubarMenu><MenubarTrigger className="app-name">Luciano Pinilla</MenubarTrigger><MenubarContent><MenubarItem onClick={()=>show('contact')}>Get in touch</MenubarItem></MenubarContent></MenubarMenu><MenubarMenu><MenubarTrigger>Work</MenubarTrigger><MenubarContent><MenubarItem onClick={()=>show('work')}>Fomo Campus</MenubarItem><MenubarItem onClick={()=>show('activity')}>GitHub activity</MenubarItem></MenubarContent></MenubarMenu><MenubarMenu><MenubarTrigger>Window</MenubarTrigger><MenubarContent>{apps.map(a=><MenubarItem key={a.id} onClick={()=>show(a.id as AppId)}>{a.name}</MenubarItem>)}<MenubarItem onClick={()=>{setOpen([]);setExpanded(null)}}>Show desktop</MenubarItem></MenubarContent></MenubarMenu></Menubar><div className="menu-status"><LocalClock/></div></header>
 <div className="desktop-heading"><h1>luciano<br/><span className="name-space"> </span>pinilla</h1><div className="identity-links"><a href="https://x.com/foezart" target="_blank" rel="noopener noreferrer">@foezart ↗</a></div></div>
 <div className="workspace">
 <Window open={open} front={front} expanded={expanded} setFront={setFront} setOpen={setOpen} setExpanded={setExpanded} id="work"><div className="work-toolbar"><span><img className="fomo-eyes toolbar-brand" src="/icons/fomo-eyes.svg" alt="Fomo"/> My Work / Fomo Campus</span><span>01</span></div><a href="https://fomo-campus-wars-luchi.luciano589188.chatgpt.site/" target="_blank" rel="noopener noreferrer" className="project-image"><img src="/images/fomo-village.jpg" alt="The Greek village from the Fomo Campus website"/><span className="project-image-label">fomo<span>campus</span></span><span className="image-arrow"><ArrowUpRight size={24}/></span></a><div className="project-copy"><div className="eyebrow">FOMO CAMPUS</div><h2>Interning at Fomo.</h2><p>Handling campus outreach, onboarding fraternities into Greek Wars, and building brand awareness for Fomo.</p><div className="project-bottom"><span className="project-tags">Web design <b>·</b> Development</span><Out href="https://github.com/ouchip/fomo-campus">View source</Out></div></div></Window>
 <Window open={open} front={front} expanded={expanded} setFront={setFront} setOpen={setOpen} setExpanded={setExpanded} id="activity"><div className="activity-body"><div className="activity-heading"><div><h2>A little more green.</h2></div><img className="github-mark activity-brand" src="/icons/github.svg" alt="GitHub"/></div><Activity/><Out className="activity-link" href="https://github.com/ouchip">github.com/ouchip</Out></div></Window>
 <Window open={open} front={front} expanded={expanded} setFront={setFront} setOpen={setOpen} setExpanded={setExpanded} id="contact"><div className="contact-body"><h2>Let’s talk.</h2><p>Send a note or reach out on X.</p><EmailContact email="luchi@lucianopinilla.com"/><Out className="contact-link" href="https://x.com/foezart">@foezart</Out></div></Window>
 </div><footer className="dock-wrap" aria-label="Desktop apps"><MacOSDock apps={apps} openApps={open} onAppClick={id=>show(id as AppId)}/></footer></main>
}


function LocalClock(){const [time,setTime]=useState('');
 useEffect(()=>{const tick=()=>setTime(new Date().toLocaleString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit'}));tick();const id=setInterval(tick,1000);return()=>clearInterval(id)},[]);
return <time className="desktop-clock" suppressHydrationWarning>{time}</time>}
