import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();

// __dirname을 그냥 사용할 경우 ReferenceError: __dirname is not defined in ES module scope라는 에러가 발생
// 방법1
// const __dirname = fileURLToPath(new URL(".", import.meta.url));
// 방법2
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

/** http server */
const server = http.createServer(app);
/** websocket server */
const wss = new WebSocketServer({ server }); //server()안의 값이 필수는 아님. 단지 같은 포트에서 둘 다 돌리고 싶어서 이렇게 작성

const onSocketClose = () => {
  console.log("Disconnected from the Browser ❌");
};

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

server.listen(3000, handleListen);
