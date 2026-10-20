import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {POST} from './dist/server/route.mjs';
const root=fileURLToPath(new URL('./dist/client/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try{
 const url=new URL(req.url,'http://'+req.headers.host);
 if(url.pathname==='/health'){res.setHeader('Content-Type','application/json');return res.end('{"ok":true}')}
 if(url.pathname==='/api/game'){
  if(req.method!=='POST'){res.writeHead(405);return res.end()}
  let data='',length=0;for await(const chunk of req){length+=chunk.length;if(length>16384){res.writeHead(413);res.end();return}data+=chunk}
  const response=await POST(new Request(url,{method:'POST',headers:{'content-type':'application/json',...(req.headers.origin?{origin:req.headers.origin}:{})},body:data}));
  res.writeHead(response.status,Object.fromEntries(response.headers));return res.end(await response.text());
 }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end()}
 const rel=decodeURIComponent(url.pathname);const file=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));
 if(!file.startsWith(root)){res.writeHead(403);return res.end()}
 const bytes=await fs.readFile(file);res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control',file.endsWith('.html')?'no-cache':'public, max-age=3600');res.end(req.method==='HEAD'?undefined:bytes);
 }catch(e){res.writeHead(e.code==='ENOENT'?404:500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e.code==='ENOENT'?'页面不存在':'服务暂不可用，请重试'}))}
});
server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Football server ready',server.address().port));
