import {env} from './storage.mjs';
import {team,act,State,resolveTyped} from './game.mjs';
export const dynamic='force-dynamic';
type Saved={state:State;tokens:string[]};
function response(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}});}
function view(saved:Saved,token:string){const side=saved.tokens.indexOf(token);if(side<0)throw Error('房间身份已失效，请重新加入');return {state:saved.state,side};}
function randomCode(){return String(100000+crypto.getRandomValues(new Uint32Array(1))[0]%900000);}
export async function POST(req:Request){try{
 if(req.headers.get('origin')&&new URL(req.headers.get('origin')!).host!==new URL(req.url).host)return response({error:'请求来源无效'},403);
 const body=await req.json() as any;if(!body||typeof body.action!=='string')return response({error:'无效请求'},400);
 const db=env.DB;if(!db)throw Error('房间服务暂不可用');const now=Date.now(),ttl=now+24*60*60*1000;
 if(body.action==='create'){
 const state:State={rulesVersion:2,code:randomCode(),phase:'waiting',teams:[team(String(body.name||''),body.club,body.formation)],turn:0,nation:null,history:[]};
 const token=crypto.randomUUID();let saved:Saved={state,tokens:[token]};
 for(let i=0;i<5;i++){state.code=randomCode();const r=await db.prepare('INSERT OR IGNORE INTO rooms (code,state,version,expires) VALUES (?,?,0,?)').bind(state.code,JSON.stringify(saved),ttl).run();if(r.meta.changes)return response({...view(saved,token),token});}throw Error('创建房间繁忙，请重试');
 }
 const code=String(body.code||'');if(!/^\d{6}$/.test(code))throw Error('请输入六位房间码');
 const row=await db.prepare('SELECT state,version FROM rooms WHERE code=? AND expires>?').bind(code,now).first<{state:string;version:number}>();if(!row)return response({error:'房间不存在或已过期（房间保留24小时）'},404);
 const saved:Saved=JSON.parse(row.state);if(saved.state.rulesVersion!==2)return response({error:'这是旧版房间。球员库与比赛规则已升级，请返回大厅创建新房间。'},410);let player;let token=typeof body.token==='string'?body.token:'';
 if(body.action==='join'){
 if(token&&saved.tokens.includes(token))return response({...view(saved,token),token});
 if(saved.state.teams.length>=2)throw Error('这个房间已经满员');saved.state.teams.push(team(String(body.name||''),body.club,body.formation));token=crypto.randomUUID();saved.tokens.push(token);saved.state.phase='draft';saved.state.turn=crypto.getRandomValues(new Uint32Array(1))[0]%2;
 }else {const {side}=view(saved,token);if(body.action==='poll')return response(view(saved,token));if(body.action==='lookup'){player=resolveTyped(saved.state,side,String(body.name||''));saved.state.previews??=[null,null];saved.state.previews[side]=player.id;}else{if(body.action==='pick')body.id=resolveTyped(saved.state,side,String(body.name||'')).id;act(saved.state,side,body.action,body);}}
 const r=await db.prepare('UPDATE rooms SET state=?,version=version+1,expires=? WHERE code=? AND version=?').bind(JSON.stringify(saved),ttl,code,row.version).run();
 if(!r.meta.changes){
  // Both players may press "ready" within the same polling interval. Re-read
  // the newest state and apply only this player's still-pending ready action.
  if(body.action==='ready'){
   for(let attempt=0;attempt<4;attempt++){
    const latest=await db.prepare('SELECT state,version FROM rooms WHERE code=? AND expires>?').bind(code,Date.now()).first<{state:string;version:number}>();
    if(!latest)return response({error:'房间不存在或已过期'},404);
    const fresh:Saved=JSON.parse(latest.state);const current=view(fresh,token);
    if(fresh.state.phase!=='ready'||fresh.state.teams[current.side]?.ready)return response(current);
    act(fresh.state,current.side,'ready');
    const retry=await db.prepare('UPDATE rooms SET state=?,version=version+1,expires=? WHERE code=? AND version=?').bind(JSON.stringify(fresh),Date.now()+24*60*60*1000,code,latest.version).run();
    if(retry.meta.changes)return response(view(fresh,token));
   }
  }
  return response({error:'对手刚刚更新了房间，请重试'},409);
 }
 return response({...view(saved,token),...(player?{player}:{}),...(body.action==='join'?{token}:{})});
 }catch(e){return response({error:e instanceof Error?e.message:'请求失败，请稍后重试'},400);}}
