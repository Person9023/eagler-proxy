const http = require('http');
const WebSocket = require('ws');

// Create a basic HTTP server (Render requires this to expose the WebSocket server)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Eaglercraft WebSocket Proxy is running.");
});

// Create the WebSocket server, attached to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('🟢 New WebSocket connection from:', req.socket.remoteAddress);

  // Example: echo messages back
  ws.on('message', (message) => {
    console.log('📨 Received message:', message.toString());
    // You can route the message to a Minecraft server if you build that logic
    ws.send(message); // Echo it back for now
  });

  ws.on('close', () => {
    console.log('🔴 WebSocket connection closed');
  });

  ws.send('✅ Connected to Eaglercraft WebSocket Proxy');
});

// Start the server on the port provided by Render
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket proxy listening on port ${PORT}`);
});
