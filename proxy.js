const http = require("http");
const express = require("express");
const { WebSocketServer } = require("ws");
const net = require("net");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Where to forward connections (your actual Minecraft server)
const MINECRAFT_HOST = "mc1716430.fmcs.cloud";
const MINECRAFT_PORT = 25565;

server.on("upgrade", function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    const mcSocket = net.connect(MINECRAFT_PORT, MINECRAFT_HOST, () => {
      ws.on("message", (msg) => mcSocket.write(msg));
      mcSocket.on("data", (chunk) => ws.send(chunk));
    });

    ws.on("close", () => mcSocket.end());
    mcSocket.on("close", () => ws.close());
    mcSocket.on("error", () => ws.close());
  });
});

app.get("/", (req, res) => {
  res.status(200).send("🟢 WebSocket proxy running");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});
