// 创建WebSocket连接
let urlold = window.location.href//取得當前網址
let url = urlold.replace("https://", "");//去除https
url = url.replace("http://", "");//去除http
url = url.replace("webtally", "");//去除/
url = url.split('/')[0];
url = url.replace("/", "");//去除/
url = "ws://" + url;//加入ws://
var socket = new WebSocket(url)


socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened');
});

socket.addEventListener('message', (event) => {
    console.log(`Received: ${event.data}`);
});

socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed');
});
var isiPad = navigator.userAgent.match(/iPad/i) !== null;
if (isiPad) {


    document.getElementById('up').addEventListener('touchstart', () => {
        document.getElementById('up').classList.add('active');
        sendcmd(0, true);
    });

    document.getElementById('down').addEventListener('touchstart', () => {
        document.getElementById('down').classList.add('active');
        sendcmd(1, true);
    });

    document.getElementById('left').addEventListener('touchstart', () => {
        document.getElementById('left').classList.add('active');
        sendcmd(2, true);
    });

    document.getElementById('right').addEventListener('touchstart', () => {
        document.getElementById('right').classList.add('active');
        sendcmd(3, true);
    });

    document.getElementById('up').addEventListener('touchend', () => {
        sendcmd(0, false);
        document.getElementById('up').classList.remove('active');
    });

    document.getElementById('down').addEventListener('touchend', () => {
        sendcmd(1, false);
        document.getElementById('down').classList.remove('active');
    });

    document.getElementById('left').addEventListener('touchend', () => {
        sendcmd(2, false);
        document.getElementById('left').classList.remove('active');
    });

    document.getElementById('right').addEventListener('touchend', () => {
        sendcmd(3, false);
        document.getElementById('right').classList.remove('active');
    });

    document.getElementById('grab').addEventListener('touchstart', () => {
        sendcmd(4, true);
        document.getElementById('grab').classList.add('active');
    });
    document.getElementById('grab').addEventListener('touchend', () => {
        document.getElementById('grab').classList.remove('active');
    });



} else {

    document.getElementById('up').addEventListener('mousedown', () => {
        sendcmd(0, true);
    });

    document.getElementById('down').addEventListener('mousedown', () => {
        sendcmd(1, true);
    });

    document.getElementById('left').addEventListener('mousedown', () => {
        sendcmd(2, true);
    });

    document.getElementById('right').addEventListener('mousedown', () => {
        sendcmd(3, true);
    });

    document.getElementById('up').addEventListener('mouseup', () => {
        sendcmd(0, false);
    });

    document.getElementById('down').addEventListener('mouseup', () => {
        sendcmd(1, false);
    });

    document.getElementById('left').addEventListener('mouseup', () => {
        sendcmd(2, false);
    });

    document.getElementById('right').addEventListener('mouseup', () => {
        sendcmd(3, false);
    });

    document.getElementById('grab').addEventListener('mousedown', () => {
        sendcmd(4, true);
    });
    let upflag = false, downflag = false, leftflag = false, rightflag = false, gflag = false;
    document.addEventListener('keydown', function (event) {
        // 檢查按下的按鍵是否為 "a"
        if (event.key === 'w') {
            // 觸發按鈕點擊事件

            document.getElementById('up').classList.add('active');
            if (!upflag && !downflag) {
                sendcmd(0, true);
                upflag = true;
            }
        }
        if (event.key === 'a') {
            // 觸發按鈕點擊事件
            document.getElementById('left').classList.add('active');
            if (!leftflag && !rightflag) {
                sendcmd(2, true);
                leftflag = true
            }
        }
        if (event.key === 's') {
            // 觸發按鈕點擊事件
            document.getElementById('down').classList.add('active');
            if (!downflag && !upflag) {
                sendcmd(1, true);
                downflag = true;
            }
        }
        if (event.key === 'd') {
            // 觸發按鈕點擊事件
            document.getElementById('right').classList.add('active');
            if (!rightflag && !leftflag) {
                sendcmd(3, true);
                rightflag = true;
            }
        }
        if (event.key === ' ') {
            // 觸發按鈕點擊事件
            document.getElementById('grab').classList.add('active');
            if (!gflag) {
                sendcmd(4, true);
                gflag = true;
            }
        }
    });
    document.addEventListener('keyup', function (event) {
        // 檢查按下的按鍵是否為 "a"
        if (event.key === 'w') {
            // 觸發按鈕點擊事件
            document.getElementById('up').classList.remove('active');
            sendcmd(0, false);
            upflag = false;
        }
        if (event.key === 'a') {
            // 觸發按鈕點擊事件
            document.getElementById('left').classList.remove('active');
            sendcmd(2, false);
            leftflag = false;
        }
        if (event.key === 's') {
            // 觸發按鈕點擊事件
            document.getElementById('down').classList.remove('active');
            sendcmd(1, false);
            downflag = false;
        }
        if (event.key === 'd') {
            // 觸發按鈕點擊事件
            document.getElementById('right').classList.remove('active');
            sendcmd(3, false);
            rightflag = false;
        }
        if (event.key === ' ') {
            // 觸發按鈕點擊事件
            document.getElementById('grab').classList.remove('active');
            gflag = false;
        }
    });
}
// 按钮点击事件，发送消息到服务器
function sendcmd(cmd, flag) {
    let key = ["up", "down", "left", "right", "grab"]
    let msg = JSON.stringify({
        "get": key[cmd],
        "flag": flag
    })
    socket.send(msg);
}