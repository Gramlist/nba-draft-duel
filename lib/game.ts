import {PLAYERS,NATIONS,FORMATIONS,CLUBS,byId,Player,Attributes} from './data';
export type Team={name:string;club:string;formation:string;lineup:(string|null)[];rerolls:number;ready:boolean;tactic:string};
export type Source='中路配合'|'边路突破'|'传中争顶'|'快速反击';
export type Event={minute:number;side:number;text:string;goal:boolean;score:number[];source:Source;shooter:string;creator:string;defender:string;keeper:string;outcome:'goal'|'saved'|'wide'|'intercepted';shot:boolean;onTarget:boolean;xg:number;creationProbability:number;onTargetProbability:number;saveProbability:number;attackValue:number;defenseValue:number};
export type Review={advantages:string[];weaknesses:string[];reason:string;suggestion:string};
export type Result={score:number[];events:Event[];shots:number[];possession:number[];power:number[];onTarget:number[];saves:number[];xg:number[];summary:string;reviews:Review[]};
export type State={rulesVersion:2;code:string;phase:'waiting'|'draft'|'ready'|'finished';teams:Team[];turn:number;nation:string|null;history:{side:number;id:string}[];previews?:(string|null)[];result?:Result};
export const tactics=['均衡推进','控球组织','快速反击'];
export function team(name:string,club:string,formation:string):Team {if(!CLUBS.some(c=>c.id===club)||!FORMATIONS[formation])throw Error('请选择有效的俱乐部和阵型');return {name:(name.trim()||CLUBS.find(c=>c.id===club)!.name).slice(0,20),club,formation,lineup:Array(11).fill(null),rerolls:2,ready:false,tactic:tactics[0]};}
export function positionPenalty(p:Player,position:string){
 if(p.positions.includes(position))return 0;
 const related:Record<string,string[]>={CB:['LCB','RCB'],LCB:['CB','RCB'],RCB:['CB','LCB'],LB:['LWB'],LWB:['LB'],RB:['RWB'],RWB:['RB'],LW:['LM'],LM:['LW'],RW:['RM'],RM:['RW'],CM:['DM','AM'],DM:['CM'],AM:['CM']};
 if((related[p.primaryPosition]||[]).includes(position))return 2;
 const group=(x:string)=>x==='GK'?'GK':['LB','RB','LWB','RWB','LCB','CB','RCB'].includes(x)?'D':['DM','CM','AM','LM','RM'].includes(x)?'M':['LW','RW','ST'].includes(x)?'F':'M';
 const from=group(p.primaryPosition),to=group(position);
 if(from==='GK'||to==='GK')return 35;
 if(from===to)return 5;
 if((from==='D'&&to==='M')||(from==='M'&&to==='D')||(from==='M'&&to==='F')||(from==='F'&&to==='M'))return 12;
 return 22;
}
export function effectiveRating(p:Player,position:string){return Math.max(25,p.rating-positionPenalty(p,position));}
function adapted(p:Player,position:string):Player{
 const penalty=positionPenalty(p,position),factor=1-penalty/100;
 return {...p,rating:effectiveRating(p,position),attributes:Object.fromEntries(Object.entries(p.attributes).map(([k,v])=>[k,k==='saving'&&position!=='GK'?Math.max(5,v*.25):Math.round(v*factor)])) as Attributes};
}
export function available(s:State,side:number,nation?:string){const t=s.teams[side];const used=new Set(s.teams.flatMap(t=>t.lineup));return PLAYERS.filter(p=>(!nation||p.nation===nation)&&!used.has(p.id)&&FORMATIONS[t.formation].some((_,i)=>!t.lineup[i]));}
export function draw(s:State,side:number,random=Math.random){let pool=NATIONS.filter(n=>available(s,side,n.id).length&&n.id!==s.nation);if(!pool.length)pool=NATIONS.filter(n=>available(s,side,n.id).length);if(!pool.length)throw Error('没有可用球员，请调整阵型');return pool[Math.floor(random()*pool.length)].id;}
export function reassign(ids:string[],formation:string):(string|null)[]|null {if(!FORMATIONS[formation])return null;const result:(string|null)[]=Array(11).fill(null);ids.slice(0,11).forEach((id,i)=>result[i]=id);return result;}
export function power(t:Team){const rows=FORMATIONS[t.formation];const avg=(positions:string[])=>{const ps=t.lineup.map((id,i)=>id&&positions.includes(rows[i])?effectiveRating(byId(id),rows[i]):null).filter((x):x is number=>x!==null);return ps.reduce((a,b)=>a+b,0)/(ps.length||1);};return {attack:avg(['LW','RW','ST','AM','LM','RM']),mid:avg(['DM','CM','AM','LM','RM']),def:avg(['LB','RB','LWB','RWB','LCB','CB','RCB']),gk:avg(['GK']),all:avg(rows)};}
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const round=(v:number)=>Math.round(v*100)/100;
const mean=(ps:Player[],key:keyof Attributes)=>ps.reduce((a,p)=>a+p.attributes[key],0)/Math.max(1,ps.length);
function playersAt(t:Team,positions:string[]){return t.lineup.flatMap((id,i)=>{const pos=FORMATIONS[t.formation][i];return id&&positions.includes(pos)?[adapted(byId(id),pos)]:[];});}
const any=(ps:Player[],random:()=>number)=>ps[Math.floor(random()*ps.length)];
function weighted<T>(items:T[],weights:number[],random:()=>number):T{let r=random()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<items.length;i++){r-=weights[i];if(r<0)return items[i];}return items[items.length-1];}
function midfield(t:Team){const ps=playersAt(t,['CM','DM','AM','LM','RM']);return mean(ps,'passing')*.65+mean(ps,'dribbling')*.25+mean(ps,'physical')*.1;}
function profiles(t:Team){const m=playersAt(t,['CM','DM','AM','LM','RM']),d=playersAt(t,['CB','LCB','RCB','LB','RB','LWB','RWB']),w=playersAt(t,['LW','RW','LM','RM']),f=playersAt(t,['ST','LW','RW','AM','LM','RM']),g=playersAt(t,['GK']);const best=(ps:Player[],key:keyof Attributes)=>[...ps].sort((a,b)=>b.attributes[key]-a.attributes[key])[0];return [
 {key:'passing',title:'组织',score:midfield(t),p:best(m,'passing'),detail:'中场传控为机会创造提供支援'},
 {key:'width',title:'边路',score:mean(w,'pace')*.45+mean(w,'dribbling')*.55,p:best(w,'dribbling'),detail:'边路速度与盘带能争取突破空间'},
 {key:'finish',title:'终结',score:mean(f,'finishing'),p:best(f,'finishing'),detail:'前场终结能力是把握机会的基础'},
 {key:'defense',title:'防守',score:mean(d,'defending')*.65+mean(d,'physical')*.35,p:best(d,'defending'),detail:'后场防守与身体对抗提供保护'},
 {key:'aerial',title:'争顶',score:mean(d,'aerial'),p:best(d,'aerial'),detail:'防线制空能应对传中对位'},
 {key:'saving',title:'门将',score:mean(g,'saving'),p:g[0],detail:'扑救能力有助于化解射正'}
 ];}
function nick(p:Player){const map:Record<string,string>={'克里斯蒂亚诺·罗纳尔多':'C罗','路易斯·苏亚雷斯·米拉蒙特斯':'苏亚雷斯·米拉蒙特斯','维克托·罗德里格斯·安德拉德':'罗德里格斯·安德拉德','贝尔纳多·席尔瓦':'B席','布鲁诺·费尔南德斯':'B费'};return map[p.name]||p.name;}
export function review(s:State,r:Result,side:number):Review{
 const t=s.teams[side],o=1-side,ours=r.events.filter(e=>e.side===side),their=r.events.filter(e=>e.side===o);
 const sorted=profiles(t).sort((a,b)=>b.score-a.score),weak=sorted[sorted.length-1];
 const advantages=sorted.slice(0,2).map(v=>`${nick(v.p)}支撑${v.title}（${Math.round(v.score)}），${v.detail}。`);
 const weaknesses=[`${weak.title}（${Math.round(weak.score)}）是队内相对弱项；${nick(weak.p)}所在环节需协同保护。`];
 const goalDiff=r.score[side]-r.score[o],difference=r.score[side]-r.xg[side],verdict=goalDiff>0?'取胜':goalDiff<0?'落败':'战平';
 const accuracy=r.shots[side]?Math.round(r.score[side]/r.shots[side]*100):0;
 const goals=ours.filter(e=>e.goal),routeCounts=new Map<Source,number>();for(const e of goals)routeCounts.set(e.source,(routeCounts.get(e.source)||0)+1);
 const bestRoute=[...routeCounts].sort((a,b)=>b[1]-a[1])[0];const saved=their.filter(e=>e.outcome==='saved');
 const key=bestRoute?`${bestRoute[0]}贡献${bestRoute[1]}球`:r.onTarget[side]?`${r.onTarget[side]}次射正均未进球`:'没有形成射正';
 let interpretation=goalDiff>0&&r.xg[side]<r.xg[o]?'机会质量未占优，终结与扑救的本场发挥带来胜势。':goalDiff<0&&r.xg[side]>r.xg[o]?'机会质量占优仍落败，转化与随机发挥影响了结果。':goalDiff===0?'双方最终转化为相同进球数，未能拉开比分。':difference>.7?'进球高于模型预期，本场把握机会较好。':difference<-.7?'进球低于模型预期，机会转化有损失。':'机会创造、对位与终结共同形成此比分。';
 const highlight=goals[0]||ours.filter(e=>e.shot).sort((a,b)=>b.xg-a.xg)[0];
 const detail=highlight?`${highlight.minute}′${nick(byId(highlight.shooter))}${highlight.goal?'攻破防线':highlight.outcome==='saved'?'射门被扑':'射门偏出'}。`:'';
 const reason=`本场${verdict}：${r.shots[side]}射${r.onTarget[side]}正，转化率${accuracy}%，模拟xG ${r.xg[side].toFixed(2)}；${key}，门将扑出${saved.length}次射正。${detail}${interpretation}`;
 let suggestion:string;
 if(weak.key==='passing')suggestion=t.tactic==='快速反击'?'保留快速反击，优先由现有中场传球最强者发起进攻。':'可改快速反击，减少中场反复组织带来的对位压力。';
 else if(weak.key==='width'||weak.key==='finish')suggestion=t.tactic==='控球组织'?'保留控球组织，让现有中场更多参与创造机会。':'可改控球组织，增加现有中场持球、创造机会的比重。';
 else suggestion=t.tactic==='控球组织'?'可改均衡推进，减少被快速反击战术针对的加成。':`可保留${t.tactic}；现有防线相对薄弱，避免改成更易被快速反击针对的控球打法。`;
 return {advantages,weaknesses,reason,suggestion};
}
export function simulate(s:State,random=Math.random):Result{
 if(s.teams.length!==2||s.teams.some(t=>t.lineup.length!==11||t.lineup.some(id=>!id||!byId(id))))throw Error('阵容未完整或位置不合法');
 const score=[0,0],shots=[0,0],onTarget=[0,0],saves=[0,0],xg=[0,0],events:Event[]=[];
 const poss=clamp(50+(midfield(s.teams[0])-midfield(s.teams[1]))*.65+(s.teams[0].tactic==='控球组织'?5:0)-(s.teams[1].tactic==='控球组织'?5:0),33,67);
 for(let minute=3;minute<=90;minute+=3){
  const side=random()<poss/100?0:1,o=1-side,t=s.teams[side],opp=s.teams[o];
  const source=weighted<Source>(['中路配合','边路突破','传中争顶','快速反击'],t.tactic==='控球组织'?[5,3,2,1]:t.tactic==='快速反击'?[2,2,2,5]:[3,3,2,2],random);
  const forwards=playersAt(t,['ST','LW','RW','AM']),wings=playersAt(t,['LW','RW']),mids=playersAt(t,['CM','DM','AM']);
  const shooter=any(source==='传中争顶'?playersAt(t,['ST']):source==='边路突破'?wings:forwards,random);
  const creators=source==='传中争顶'||source==='边路突破'?playersAt(t,['LB','RB','LW','RW']):mids;
  const others=creators.filter(p=>p.id!==shooter.id),creator=any(others.length?others:creators,random);
  const defender=any(playersAt(opp,source==='边路突破'?['LB','RB']:source==='中路配合'?['CB','DM']:['CB']),random),keeper=playersAt(opp,['GK'])[0];
  const a=shooter.attributes,c=creator.attributes,d=defender.attributes;
  const attackValue=source==='传中争顶'?c.passing*.45+a.aerial*.4+a.physical*.15:source==='快速反击'?a.pace*.45+c.passing*.35+a.dribbling*.2:source==='边路突破'?a.dribbling*.45+a.pace*.3+c.passing*.25:c.passing*.5+a.dribbling*.35+a.physical*.15;
  const defenseValue=source==='传中争顶'?d.aerial*.5+d.defending*.3+d.physical*.2:source==='快速反击'?d.pace*.45+d.defending*.4+d.physical*.15:source==='边路突破'?d.defending*.45+d.pace*.35+d.physical*.2:d.defending*.6+d.physical*.25+mean(playersAt(opp,['CM','DM','AM']),'defending')*.15;
  const counterBonus=source==='快速反击'&&t.tactic==='快速反击'&&opp.tactic==='控球组织'?.06:0;
  const creationProbability=clamp(.66+(attackValue-defenseValue)*.008+counterBonus,.25,.9);
  const onTargetProbability=clamp(.44+(a.finishing-80)*.011+(attackValue-defenseValue)*.003,.2,.78);
  const saveProbability=clamp(.68+(keeper.attributes.saving-a.finishing)*.009-(attackValue-defenseValue)*.002,.35,.88);
  let outcome:Event['outcome'];let shot=false,target=false,goal=false,expected=0;
  if(random()>creationProbability)outcome='intercepted';else{shot=true;shots[side]++;expected=onTargetProbability*(1-saveProbability);xg[side]+=expected;if(random()>onTargetProbability)outcome='wide';else{target=true;onTarget[side]++;if(random()<saveProbability){outcome='saved';saves[o]++;}else{outcome='goal';goal=true;score[side]++;}}}
  const lead=`${source}：${creator.name}发起配合，`;const text=outcome==='intercepted'?`${lead}${defender.name}限制住${shooter.name}，未形成射门。`:outcome==='wide'?`${lead}${shooter.name}完成射门，但偏离目标。`:outcome==='saved'?`${lead}${shooter.name}射正，${keeper.name}将球扑出。`:`${lead}${shooter.name}破门！`;
  events.push({minute,side,text,goal,score:[...score],source,shooter:shooter.id,creator:creator.id,defender:defender.id,keeper:keeper.id,outcome,shot,onTarget:target,xg:expected,creationProbability,onTargetProbability,saveProbability,attackValue,defenseValue});
 }
 const result:Result={score,events,shots,onTarget,saves,xg:xg.map(round),possession:[Math.round(poss),100-Math.round(poss)],power:s.teams.map(t=>round(power(t).all)),summary:'',reviews:[]};
 result.summary=score[0]===score[1]?`${score[0]}∶${score[1]}握手言和；双方模拟xG为${result.xg[0].toFixed(2)}与${result.xg[1].toFixed(2)}，最终进球相同。`:`${s.teams[score[0]>score[1]?0:1].name}以${Math.max(...score)}∶${Math.min(...score)}取胜；具体原因见双方机会与终结复盘。`;
 result.reviews=[review(s,result,0),review(s,result,1)];return result;
}
export function act(s:State,side:number,action:string,payload:any={},random=Math.random){
 const t=s.teams[side];if(!t)throw Error('你不在这个房间');
 if(action==='formation'){if(!['waiting','draft','ready'].includes(s.phase))throw Error('比赛已结束');if(!FORMATIONS[payload.formation])throw Error('无效阵型');const r=reassign(t.lineup.filter((x):x is string=>!!x),payload.formation);if(!r)throw Error('已有球员无法全部适配此阵型');t.formation=payload.formation;t.lineup=r;if(s.previews)s.previews[side]=null;t.ready=false;if(s.nation&&s.turn===side&&!available(s,side,s.nation).length)s.nation=null;return;}
 if(action==='tactic'){if(!['waiting','draft','ready'].includes(s.phase)||!tactics.includes(payload.tactic))throw Error('无法修改战术');t.tactic=payload.tactic;t.ready=false;return;}
 if(action==='ready'){if(s.phase!=='ready')throw Error('请先选满阵容');t.ready=!t.ready;if(s.teams.every(t=>t.ready)){s.result=simulate(s,random);s.phase='finished';}return;}
 if(s.phase!=='draft'||s.turn!==side)throw Error('请等待你的选人回合');
 if(action==='draw'){if(s.nation)throw Error('本回合已经抽取国家');s.nation=draw(s,side,random);return;}
 if(action==='reroll'){if(!s.nation||t.rerolls<=0)throw Error('没有可用的重抽机会');s.nation=draw(s,side,random);if(s.previews)s.previews[side]=null;t.rerolls--;return;}
 if(action==='pick'){const p=available(s,side,s.nation||'NONE').find(p=>p.id===payload.id);const index=payload.slot;if(!p||!Number.isInteger(index)||index<0||index>10||t.lineup[index])throw Error('该球员无法放入这个位置，或已被选择');t.lineup[index]=p.id;if(s.previews)s.previews[side]=null;s.history.push({side,id:p.id});s.nation=null;if(s.teams.every(t=>t.lineup.every(Boolean)))s.phase='ready';else s.turn=1-side;return;}
 throw Error('未知操作');
}

export const normalizeName=(name:string)=>name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[\s·.\-_’']/g,'');
export function resolveTyped(s:State,side:number,input:string):Player {
 if(s.phase!=='draft'||s.turn!==side||!s.nation)throw Error('请在自己的回合先抽取国家');
 const key=normalizeName(input.trim());if(!key)throw Error('请先输入球员姓名');
 const matches=PLAYERS.filter(p=>{const words=p.aliases.split(/\s+/);const end=words.findIndex(w=>!/^[A-Za-zÀ-ž0-9.'-]+$/.test(w));const english=words.slice(0,end<0?words.length:end).join(' ');const aliases=[p.name,english,...words];return aliases.some(a=>normalizeName(a)===key)});
 const nationals=matches.filter(p=>p.nation===s.nation);
 if(!nationals.length)throw Error('该姓名未匹配到抽中国家的已收录球员，请检查姓名或常用别名');
 if(nationals.length>1)throw Error('姓名不够明确，请输入完整姓名');
 const p=nationals[0];if(s.teams.some(t=>t.lineup.includes(p.id)))throw Error('这名球员已被选走，请输入另一位球员');
 if(!available(s,side,s.nation).some(x=>x.id===p.id))throw Error('这名球员无法适配你的空缺位置，请调整阵型或输入另一位球员');
 return p;
}
