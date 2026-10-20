import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {available} from '../dist/server/game.mjs';
import {FORMATIONS,PLAYERS} from '../dist/server/data.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'football-http-'));let proc,port;
async function start(){proc=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:'0',DATA_DIR:dir},stdio:['ignore','pipe','inherit']});port=await new Promise((resolve,reject)=>{proc.stdout.on('data',x=>{const m=String(x).match(/ready (\d+)/);if(m)resolve(m[1])});proc.once('exit',()=>reject(Error('Server exited')))});}
async function stop(){const end=once(proc,'exit');proc.kill();await end;}
async function call(body){const r=await fetch(`http://127.0.0.1:${port}/api/game`,{method:'POST',headers:{'Content-Type':'application/json',Origin:`http://127.0.0.1:${port}`},body:JSON.stringify(body)});return {...await r.json(),status:r.status}}
try{
await start();assert.equal(PLAYERS.length,567);
assert((await (await fetch(`http://127.0.0.1:${port}/`)).text()).includes('足坛·时空对决'));
const a=await call({action:'create',club:'real',formation:'4-3-3'});assert.equal(a.status,200);const code=a.state.code,tokens=[a.token];
const results=await Promise.all([call({action:'join',code,club:'barca',formation:'4-4-2'}),call({action:'join',code,club:'city',formation:'4-4-2'})]);assert.equal(results.filter(x=>x.status===200).length,1);const b=results.find(x=>x.status===200);tokens.push(b.token);let s=b.state;
for(let n=0;n<22;n++){const side=s.turn,token=tokens[side];let x=await call({action:'draw',code,token});assert.equal(x.status,200);s=x.state;const p=available(s,side,s.nation)[0],slot=FORMATIONS[s.teams[side].formation].findIndex((v,i)=>!s.teams[side].lineup[i]&&p.positions.includes(v));x=await call({action:'lookup',code,token,name:p.name});assert.equal(x.player.id,p.id);assert.equal((await call({action:'poll',code,token:tokens[1-side]})).state.previews[side],p.id);assert.equal((await call({action:'pick',code,token,id:p.id,slot})).status,400);x=await call({action:'pick',code,token,name:p.name,slot});assert.equal(x.status,200);s=x.state;assert.deepEqual((await call({action:'poll',code,token:tokens[1-side]})).state,s);}
await call({action:'ready',code,token:tokens[0]});const end=await call({action:'ready',code,token:tokens[1]});assert.equal(end.state.phase,'finished');
await stop();await start();assert.deepEqual((await call({action:'poll',code,token:tokens[0]})).state,end.state);assert.equal((await call({action:'join',code,token:tokens[1]})).side,1);
console.log('PASS: 567 players; real HTTP create/join; concurrent seat protection; 22 typed picks; peer preview; identical result; process restart with retained database.');
}finally{if(proc?.exitCode===null)await stop();fs.rmSync(dir,{recursive:true,force:true});}
