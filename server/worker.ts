import handler from 'vinext/server/fetch-handler';
import {campusResponse} from '../lib/campus-proxy';
import {secureSiteResponse} from './security-headers';

export default {
  async fetch(request:Request,env:unknown,ctx:unknown){
    const url=new URL(request.url),path=url.pathname;
    if(url.protocol!=='https:'&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname)){url.protocol='https:';return Response.redirect(url.href,308)}
    // The portfolio has no server actions or write endpoints.
    if(!['GET','HEAD'].includes(request.method))return secureSiteResponse(request,new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}}));
    const response=path==='/campus'||path.startsWith('/campus/')?await campusResponse(request):await handler.fetch(request,env,ctx);
    return secureSiteResponse(request,response);
  }
};
