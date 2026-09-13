import handler from 'vinext/server/fetch-handler';
import {campusResponse} from '../lib/campus-proxy';

export default {
  async fetch(request:Request,env:unknown,ctx:unknown){
    const path=new URL(request.url).pathname;
    if(path==='/campus'||path.startsWith('/campus/'))return campusResponse(request);
    return handler.fetch(request,env,ctx);
  }
};
