var fs = require('fs');
var url = require('url'); // không sử dụng điều hướng 
var http = require('http');
var WebSocket = require('ws');
// function gửi yêu cầu(response) từ phía server hoặc nhận yêu cầu (request) của client gửi lên
function requestHandler(request, response) {
    fs.readFile('./index.html', function(error, content) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.end(content);
    });
}
// create http server
var server = http.createServer(requestHandler);
var ws = new WebSocket.Server({
    server
});
var clients = [];

function broadcast(socket, data) {
    console.log(clients.length);
    for (var i = 0; i < clients.length; i++) {
        if (clients[i] != socket) {
            clients[i].send(data);
        }
    }
}
ws.on('connection', function(socket, req) {
    clients.push(socket);
    socket.on('message', function(message) {
        console.log('received: %s', message);
        broadcast(socket, message);
    });
    socket.on('close', function() {
        var index = clients.indexOf(socket);
        clients.splice(index, 1);
        console.log('disconnected');
    });
});
server.listen(3000);
console.log('Server listening on port 3000');