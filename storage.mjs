import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
const dir=process.env.DATA_DIR||'.data';mkdirSync(dir,{recursive:true});
const db=new DatabaseSync(path.join(dir,'rooms.sqlite'));
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS rooms(code TEXT PRIMARY KEY,state TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 0,expires INTEGER NOT NULL);');
const cleanup=()=>db.prepare('DELETE FROM rooms WHERE expires < ?').run(Date.now());cleanup();setInterval(cleanup,60000).unref();
export const env={DB:{prepare(sql){return{bind(...args){return{async first(){return db.prepare(sql).get(...args)},async run(){return{meta:{changes:Number(db.prepare(sql).run(...args).changes)}}}}}}}}};
