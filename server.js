const portPath = '/dev/ttyACM0'
const { SerialPort } = require('serialport')
const serialport = new SerialPort({ path: portPath, baudRate: 115200 })

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 8765;
serialport.on('data', function (data) {
  console.log(data.toString());
});
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// WebSocket处理
wss.on('connection', (ws) => {
  console.log('Client connected');

  // 监听客户端发送的消息
  ws.on('message', (message) => {
    //console.log(`Received: ${message}`);
    let jsonmsg = JSON.parse(message)
    if (jsonmsg.get == "get") {
      console.log("get it!")
      send("getit")
    } else {
      serialport.write(message + "\r\n")
    }

  });

  // 监听连接关闭事件
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
function send(data) {
  let clients = wss.clients;
  clients.forEach((client) => {
    let sendData = data
    client.send(sendData);//回去的資料
    // sock2.send(sendData);
  });
}