import fs from 'node:fs';
import ts from 'typescript';
fs.mkdirSync('dist/server',{recursive:true});
for(const name of ['data','extra-players','game','route']){
 let src=fs.readFileSync(name==='route'?'route.ts':`lib/${name}.ts`,'utf8').replaceAll("'./data'","'./data.mjs'").replaceAll("'./extra-players'","'./extra-players.mjs'");
 fs.writeFileSync(`dist/server/${name}.mjs`,ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
}
fs.copyFileSync('storage.mjs','dist/server/storage.mjs');
