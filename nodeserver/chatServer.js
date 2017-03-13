var express = require('express');
var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

var PORT = 8082;
server.listen(PORT);
console.log("server on http://127.0.0.1:" + PORT);

app.use(express.static('./'));
var nbPlayersMax = 2;
var players = {};
io.sockets.on('connection', function (socket) {
    socket.on('adduser', function(username){
        socket.username = username;
        players[username] = socket;
        if (Object.keys(players).length === nbPlayersMax){
            io.sockets.emit('startgame', Object.keys(players));
        }
    });

    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('disconnect', function(){
        delete players[socket.username];
    });
});