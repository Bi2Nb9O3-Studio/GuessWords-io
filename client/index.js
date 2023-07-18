// Initialize WebSocket connection and event handlers
var ws;
function setup(obj) {
    var id;
    log("开始连接")
    ws = new WebSocket("ws://localhost:1145");
    // Listen for the connection open event then call the sendMessage function
    ws.onopen = function (e) {
        sendMessage("WAITING FIRST username:" + document.getElementById("username").value)
    }
    // Listen for the close connection event
    ws.onclose = function (e) {
        log("Disconnected:" + e.reason);
        obj.disabled = "";
        document.getElementById("error").innerText = "连接失败，请重试";
    }
    // Listen for connection errors
    ws.onerror = function (e) {
        log("Error" + e);

        ws.close();
    }
    // Listen for new messages arriving at the client
    ws.onmessage = function (e) {
        if (e.data == "testconn") {
            sendMessage("WAITING delay id=" + id + ",delay=" + caldelay());
        } else if (e.data.search(/^id:/) != -1) {
            id = e.data.split(":")[1];
            log("ID:" + id);
            enter(id);
        } else if (e.data.search(/^GAMING data:/) != -1) {
            log(e.data);
            listplayers(e.data.replace("GAMING data:", ""));
        } else {
            log(e.data);
        }
    }
    document.body.onunload = () => {
        log("断开连接");
        ws.close();
    }
}
// Send a message on the WebSocket.
function sendMessage(msg) {
    ws.send(msg);
    log("发送信息：" + msg);
}
function log(msg) {
    document.getElementById("console").innerText += (msg + "\n")
}
function caldelay() {
    if (!isNaN(new Date() - delay - 1000)) {
        let temp = new Date() - delay - 1000
        document.getElementById("delay").innerText = temp;
        delay = new Date();
        return temp;
    } else {
        delay = new Date();
        return 0;
    }
}

function enter(id) {
    document.getElementById("preparation").style.display = "none";
    document.getElementById("room-list").style.display = "unset";
    document.getElementById("id-display").innerText = id;
    document.getElementById("username-display").innerText = document.getElementById("username").value;
}

function listplayers(ouser) {
    var user = JSON.parse(ouser);
    document.getElementById("user-list").innerHTML = "";
    for (const userown in user["user"]) {
        li = document.createElement("li");
        li.innerText = "#" + (parseInt(userown) + 1) + "    " + user["user"][userown]["name"] + "  " + user["user"][userown]["delay"] + "ms";
        document.getElementById("user-list").appendChild(li);
    }
}