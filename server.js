const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// WebSocket处理
wss.on('connection', (ws) => {
  console.log('Client connected');

  // 监听客户端发送的消息
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  // 监听连接关闭事件
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
