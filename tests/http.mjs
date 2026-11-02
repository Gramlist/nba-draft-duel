import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {available,team,simulate} from '../dist/server/game.mjs';
import {FORMATIONS,PLAYERS} from '../dist/server/data.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'football-http-'));let proc,port;
async function start(){proc=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:'0',DATA_DIR:dir},stdio:['ignore','pipe','inherit']});port=await new Promise((resolve,reject)=>{proc.stdout.on('data',x=>{const m=String(x).match(/ready (\d+)/);if(m)resolve(m[1])});proc.once('exit',()=>reject(Error('Server exited')))});}
async function stop(){const end=once(proc,'exit');proc.kill();await end;}
async function call(body){const r=await fetch(`http://127.0.0.1:${port}/api/game`,{method:'POST',headers:{'Content-Type':'application/json',Origin:`http://127.0.0.1:${port}`},body:JSON.stringify(body)});return {...await r.json(),status:r.status}}
try{
await start();assert.equal(PLAYERS.length,571); assert.equal(Object.keys(FORMATIONS).length,11); for(const name of ['特伦特·亚历山大-阿诺德','费代里科·基耶萨','麦孔','胡梅尔斯','热罗姆·博阿滕','罗伯托·巴乔']) assert(PLAYERS.some(p=>p.name===name),`missing ${name}`);
assert((await (await fetch(`http://127.0.0.1:${port}/`)).text()).includes('足坛·时空对决'));
const formations=Object.keys(FORMATIONS);
const keepers=PLAYERS.filter(p=>p.positions.includes('GK')).slice(0,2);
const outfield=PLAYERS.filter(p=>!p.positions.includes('GK')).slice(0,20);
assert.equal(keepers.length,2);assert.equal(outfield.length,20);
for(const home of formations)for(const away of formations){
 const teams=[team('主队','real',home),team('客队','barca',away)];
 for(let side=0;side<2;side++){
  teams[side].lineup[0]=keepers[side].id;
  for(let pos=1;pos<11;pos++)teams[side].lineup[pos]=outfield[side*10+pos-1].id;
 }
 const testState={rulesVersion:2,code:'test',phase:'ready',teams,turn:0,nation:null,history:[]};
 let n=0;const result=simulate(testState,()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;});
 assert(result&&result.score.length===2&&result.events.length===30,`formation mismatch ${home} vs ${away}`);
 assert(result.events.every(e=>e.shooter&&e.creator&&e.defender&&e.keeper),`missing player ${home} vs ${away}`);
}

const a=await call({action:'create',club:'real',formation:'4-3-3'});assert.equal(a.status,200);const code=a.state.code,tokens=[a.token];
const results=await Promise.all([call({action:'join',code,club:'barca',formation:'4-4-2'}),call({action:'join',code,club:'city',formation:'4-4-2'})]);assert.equal(results.filter(x=>x.status===200).length,1);const b=results.find(x=>x.status===200);tokens.push(b.token);let s=b.state;
for(let n=0;n<22;n++){const side=s.turn,token=tokens[side];let x=await call({action:'draw',code,token});assert.equal(x.status,200);s=x.state;const p=available(s,side,s.nation)[0],slot=FORMATIONS[s.teams[side].formation].findIndex((v,i)=>!s.teams[side].lineup[i]);x=await call({action:'lookup',code,token,name:p.name});assert.equal(x.player.id,p.id);assert.equal((await call({action:'poll',code,token:tokens[1-side]})).state.previews[side],p.id);assert.equal((await call({action:'pick',code,token,id:p.id,slot})).status,400);x=await call({action:'pick',code,token,name:p.name,slot});assert.equal(x.status,200);s=x.state;assert.deepEqual((await call({action:'poll',code,token:tokens[1-side]})).state,s);}
const readyResults=await Promise.all([call({action:'ready',code,token:tokens[0]}),call({action:'ready',code,token:tokens[1]})]);assert(readyResults.every(x=>x.status===200),JSON.stringify(readyResults.map(x=>({status:x.status,error:x.error}))));const end=await call({action:'poll',code,token:tokens[0]});assert.equal(end.state.phase,'finished');assert(readyResults.every(x=>x.state.phase==='ready'||x.state.phase==='finished'));assert(end.state.teams.every(t=>t.ready));
await stop();await start();assert.deepEqual((await call({action:'poll',code,token:tokens[0]})).state,end.state);assert.equal((await call({action:'join',code,token:tokens[1]})).side,1);
console.log('PASS: 571 players; all 121 formation matchups simulated; 11 formations; any-position picks; real HTTP create/join; concurrent seat protection; 22 typed picks; peer preview; identical result; process restart with retained database.');
}finally{if(proc?.exitCode===null)await stop();fs.rmSync(dir,{recursive:true,force:true});}
