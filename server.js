import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_, res) => res.json({ ok: true }));

const rooms = new Map();

function freshRoom(code, hostId) {
  return {
    code,
    hostId,
    phase: "lobby",
    players: {
      p1: { socketId: hostId, connected: true, lineup: {} },
      p2: { socketId: null, connected: false, lineup: {} }
    },
    currentTurn: "p1",
    currentTeam: null,
    draftedPlayerIds: [],
    searchText: "",
    result: null,
    createdAt: Date.now()
  };
}
function makeCode(){
  for(let i=0;i<10000;i++){
    const code = String(Math.floor(1000 + Math.random()*9000));
    if(!rooms.has(code)) return code;
  }
  return String(crypto.randomInt(1000,9999));
}
function roomForSocket(socketId){
  for (const room of rooms.values()){
    if(room.players.p1.socketId===socketId || room.players.p2.socketId===socketId) return room;
  }
  return null;
}
function emitRoom(room){
  io.to(room.code).emit("room_state", sanitize(room));
}
function sanitize(room){
  return JSON.parse(JSON.stringify(room));
}
function other(p){ return p==="p1" ? "p2":"p1"; }
function positionsFull(lineup){
  return ["PG","SG","SF","PF","C"].every(p=>lineup[p]);
}

io.on("connection", (socket)=>{
  socket.on("create_room", ()=>{
    const old = roomForSocket(socket.id);
    if(old) rooms.delete(old.code);
    const code = makeCode();
    const room = freshRoom(code, socket.id);
    rooms.set(code, room);
    socket.join(code);
    socket.emit("room_created", { code, player:"p1" });
    emitRoom(room);
  });

  socket.on("join_room", ({code})=>{
    code = String(code||"").trim();
    const room = rooms.get(code);
    if(!room) return socket.emit("error_message","房间不存在");
    if(room.players.p2.socketId && room.players.p2.connected) return socket.emit("error_message","房间已满");
    room.players.p2.socketId = socket.id;
    room.players.p2.connected = true;
    socket.join(code);
    socket.emit("room_joined",{code,player:"p2"});
    room.phase = "draft";
    emitRoom(room);
  });

  socket.on("roll_team", ({code})=>{
    const room = rooms.get(String(code));
    if(!room) return;
    const who = room.players.p1.socketId===socket.id ? "p1" : room.players.p2.socketId===socket.id ? "p2" : null;
    if(who!==room.currentTurn || room.phase!=="draft") return;
    const teams = ["ATL","BOS","BKN","CHA","CHI","CLE","DAL","DEN","DET","GSW","HOU","IND","LAC","LAL","MEM","MIA","MIL","MIN","NOP","NYK","OKC","ORL","PHI","PHX","POR","SAC","SAS","TOR","UTA","WAS"];
    room.phase = "rolling";
    emitRoom(room);
    const teamId = teams[Math.floor(Math.random()*teams.length)];
    room.currentTeam = teamId;
    room.searchText = "";
    setTimeout(()=>{
      if(!rooms.has(room.code)) return;
      room.phase = "selecting";
      emitRoom(room);
    }, 1400);
  });

  socket.on("search_text", ({code,text})=>{
    const room=rooms.get(String(code));
    if(!room || room.phase!=="selecting") return;
    const who = room.players.p1.socketId===socket.id ? "p1" : room.players.p2.socketId===socket.id ? "p2" : null;
    if(who!==room.currentTurn) return;
    room.searchText = String(text||"").slice(0,50);
    io.to(room.code).emit("search_updated",{player:who,text:room.searchText});
  });

  socket.on("draft_player", ({code, playerCard, position})=>{
    const room=rooms.get(String(code));
    if(!room || room.phase!=="selecting") return;
    const who = room.players.p1.socketId===socket.id ? "p1" : room.players.p2.socketId===socket.id ? "p2" : null;
    if(who!==room.currentTurn) return;
    if(!playerCard || playerCard.teamId!==room.currentTeam) return socket.emit("error_message","该球员不属于当前球队版本");
    if(room.draftedPlayerIds.includes(playerCard.playerId)) return socket.emit("error_message","该球员已被选走");
    if(!playerCard.eligiblePositions.includes(position)) return socket.emit("error_message","该球员不能打这个位置");
    if(room.players[who].lineup[position]) return socket.emit("error_message","该位置已有球员");

    room.players[who].lineup[position]=playerCard;
    room.draftedPlayerIds.push(playerCard.playerId);
    room.currentTeam=null;
    room.searchText="";
    room.currentTurn=other(who);

    if(positionsFull(room.players.p1.lineup) && positionsFull(room.players.p2.lineup)){
      room.phase="ready";
    } else {
      room.phase="draft";
    }
    emitRoom(room);
  });

  socket.on("start_simulation", ({code,result})=>{
    const room=rooms.get(String(code));
    if(!room || room.phase!=="ready") return;
    if(socket.id!==room.hostId) return socket.emit("error_message","由房主开始比赛");
    room.phase="result";
    room.result=result;
    emitRoom(room);
  });

  socket.on("new_game", ({code})=>{
    const room=rooms.get(String(code));
    if(!room || socket.id!==room.hostId) return;
    room.phase="draft";
    room.currentTurn="p1";
    room.currentTeam=null;
    room.draftedPlayerIds=[];
    room.searchText="";
    room.result=null;
    room.players.p1.lineup={};
    room.players.p2.lineup={};
    emitRoom(room);
  });

  socket.on("disconnect", ()=>{
    const room=roomForSocket(socket.id);
    if(!room) return;
    if(room.players.p1.socketId===socket.id) room.players.p1.connected=false;
    if(room.players.p2.socketId===socket.id) room.players.p2.connected=false;
    emitRoom(room);
    setTimeout(()=>{
      const r=rooms.get(room.code);
      if(r && !r.players.p1.connected && !r.players.p2.connected) rooms.delete(room.code);
    }, 30*60*1000);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", ()=>console.log(`NBA Draft Duel running on :${PORT}`));
