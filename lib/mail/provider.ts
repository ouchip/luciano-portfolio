/** Server-only mail transport. No provider key may be imported into a client component. */
export const MAILBOX='luchi@lucianopinilla.com';
export type MailAttachment={id:string;filename:string;content_type:string;size:number};
export type ReceivedMail={id:string;from:string;to:string[];cc:string[];subject:string;created_at:string;message_id:string;reply_to?:string[];text?:string|null;html?:string|null;attachments?:MailAttachment[]};
export function addressedToMailbox(mail:Pick<ReceivedMail,'to'|'cc'>){return [...(mail.to??[]),...(mail.cc??[])].some(value=>{const match=value.match(/<([^<>]+)>/);return (match?.[1]??value).trim().toLowerCase()===MAILBOX})}
export async function providerRequest<T>(key:string,path:string,init:RequestInit={}):Promise<T>{
 if(!key)throw new Error('Mail service is not configured');
 if(!path.startsWith('/emails'))throw new Error('Unsupported mail operation');
 const response=await fetch('https://api.resend.com'+path,{...init,headers:{...init.headers,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error(`Mail service request failed (${response.status})`);
 return response.json() as Promise<T>;
}
export async function listReceived(key:string,after?:string){
 const params=new URLSearchParams({limit:'100'});if(after)params.set('after',after);
 const result=await providerRequest<{data:ReceivedMail[];has_more:boolean}>(key,'/emails/receiving?'+params);
 return {messages:result.data.filter(addressedToMailbox),hasMore:result.has_more,nextCursor:result.data.at(-1)?.id};
}
export async function getReceived(key:string,id:string){
 if(!/^[a-f0-9-]{36}$/i.test(id))throw new Error('Invalid message ID');
 const mail=await providerRequest<ReceivedMail>(key,'/emails/receiving/'+id);
 if(!addressedToMailbox(mail))throw new Error('Message is not addressed to this inbox');
 return mail;
}
