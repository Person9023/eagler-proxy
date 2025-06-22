const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const net = require('net');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const minecraft = net.connect({ host: 'mc1716430.fmcs.cloud', port: 25565 });

  ws.on('message', function incoming(message) {
    minecraft.write(message);
  });

  minecraft.on('data', function(data) {
    ws.send(data);
  });

  ws.on('close', () => minecraft.end());
  minecraft.on('close', () => ws.close());
});

server.listen(process.env.PORT || 10000, () => {
  console.log('WebSocket proxy listening on port ${PORT}');
});
