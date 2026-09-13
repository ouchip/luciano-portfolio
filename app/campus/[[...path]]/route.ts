import {campusResponse} from '@/lib/campus-proxy';
export const dynamic='force-dynamic';
export async function GET(request:Request){return campusResponse(request)}
export async function HEAD(request:Request){return campusResponse(request)}
