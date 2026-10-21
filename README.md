# 足坛·时空对决 — Render 版

17 个国家、568 名真实球员、16 家俱乐部队徽。双人输入六位房间码联机，轮流抽国家并输入球员名字，阵容和确认后的候选球员实时同步。比赛与复盘由服务端统一生成。

## Render 部署

本分支 `football-render` 用于足球版。篮球版仍使用 `main`，不要把此分支合并到篮球主分支。

1. Render → New → Web Service。
2. 选择仓库 `Gramlist/nba-draft-duel`。
3. Name 填 `football-draft-duel`（若被占用，可加个人后缀）。
4. Branch 选 `football-render`；Language/Runtime 选 Docker。
5. Root Directory 留空；Dockerfile Path 为 `./Dockerfile`。
6. Instance Type 选 Free，Health Check Path 为 `/health`。
7. 点击 Deploy Web Service，等待 Live 后使用 Render 实际分配的网址。

两位玩家打开同一个足球网址，一人创建房间，另一人输入六位码加入。旧 ChatGPT Site 房间不会迁移。

## 数据与恢复

房间保留上限为最后一次操作后 24 小时。浏览器保存身份令牌，正常刷新或断网重连可恢复原位置；不要清除站点数据。服务使用 SQLite，默认写入 `.data`。

**Render Free 的文件系统不持久，休眠、实例替换或重新部署可能清空房间。** 如需跨这些事件可靠保留房间，使用带持久磁盘的服务并设置 `DATA_DIR` 为挂载目录；需单独决定付费方案。免费实例长时间未访问后，首次打开可能需等待唤醒。

## 开发与验证

Node 24；`npm install` → `npm run build` → `npm test` → `npm start`。

`npm test` 使用实际 HTTP 服务验证：并发加入不超两人、22 次手输选人、对方预览同步、双方比分复盘一致、数据库保留时进程重启恢复。

当前未进行 Render 线上或两台实体手机验证，部署后仍需检查双方实际网络访问。
