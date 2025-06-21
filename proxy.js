// proxy.js
const WebSocket = require('ws');
const net = require('net');

const PORT = process.env.PORT || 8080; // Replit sets this automatically
const REMOTE_HOST = "mc1716430.fmcs.cloud"; // Change this to your Minecraft server IP/domain
const REMOTE_PORT = 25565; // Default Minecraft port

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  const tcpSocket = new net.Socket();

  tcpSocket.connect(REMOTE_PORT, REMOTE_HOST, () => {
    // TCP connected
  });

  ws.on('message', (msg) => {
    tcpSocket.write(msg);
  });

  tcpSocket.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  ws.on('close', () => {
    tcpSocket.end();
  });

  tcpSocket.on('close', () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });

  tcpSocket.on('error', (err) => {
    console.error('TCP Socket error:', err.message);
    if (ws.readyState === WebSocket.OPEN) ws.close();
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
    tcpSocket.end();
  });
});

console.log(`WebSocket proxy listening on port ${PORT}`);
