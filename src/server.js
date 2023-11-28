import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();

const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    console.log(roomName); // front에서 실행
    setTimeout(() => {
      done("hello from the backend"); // backend에서 실행되지 않음. 보안 문제가 생길 수 있다.
    }, 5000);
  });
});

httpServer.listen(3000, handleListen);
