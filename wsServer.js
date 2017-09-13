var ws=require("nodejs-websocket");
var port="3000";
// 每个客户端一个名字
var clientCount=0;
var server=ws.createServer(function(conn){
	console.log("New connection");
	clientCount++;
	conn.nickname="user"+clientCount;
	// 包装对应的信息成对象
	var mes={};
	 mes.type="enter";
	 mes.data=conn.nickname+"come in";
	broadcast(JSON.stringify(mes));
	conn.on("text",function(str){
		console.log("received",str);
		var mes={};
		mes.type="message";
		//区分是谁发的消息
		mes.data=conn.nickname+" "+str;
		broadcast(JSON.stringify(mes));
	})
	conn.on("close",function(code,reason){
		console.log("connection closed");
		var mes={};
		mes.type="leave";
		mes.data=conn.nickname+"left";
		// broadcast(conn.nickname+"left");
		broadcast(JSON.stringify(mes));
	})
	conn.on("error",function(err){
		console.log("handle err");
		console.log(err)
	})
}).listen(port);
console.log("websocket server listening on port"+port);
function broadcast(str){
	// 该server下的所有websocket连接
	server.connections.forEach(function(connection){
		connection.sendText(str);
	})
}
// 这些都是可以通过框架来实现socket.io
// 