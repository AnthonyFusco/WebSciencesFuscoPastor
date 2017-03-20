var express = require('express');
var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

let PORT = 8082;
server.listen(PORT);
console.log("server on http://127.0.0.1:" + PORT);

app.use(express.static('./'));
let nbPlayersMax = 2;
let players = {};
let restart = 0;
io.sockets.on('connection', function (socket) {
    socket.on('adduser', function(username){
        socket.username = username;
        players[username] = socket;
        if (Object.keys(players).length == nbPlayersMax){
            io.sockets.emit('startgame', Object.keys(players));
        }
    });

    socket.on("keyboardevent", function(event, boolean){
        io.sockets.emit("keyboardevent", socket.username, event, boolean);
    });

    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('disconnect', function(){
        delete players[socket.username];
    });

    socket.on("givemecoords", function (coords) {
        io.sockets.emit("setcoords", socket.username, coords);
    });

    socket.on("iShotYou", function(life, playerName){
        players[playerName].life = life;
        io.sockets.emit("playerShooted", playerName, life);
    });

    socket.on("shoot", function(data){
        console.log('new');
        io.sockets.emit("newBullet", socket.username, data);
    });

    socket.on('iwalkedonspikes', function(){
        socket.life = 0;
        io.sockets.emit("endgame", socket.username);
    });

    socket.on("endgame", function(loosername){
        io.sockets.emit("endgame", loosername);
    });

    socket.on('iwantrestart', function(){
        restart++;
        if (Object.keys(players).length == restart){
            restart = 0;
            io.sockets.emit('startgame', Object.keys(players));
        }
    });

    setInterval(function(){
        io.sockets.emit("givemecoords");
    }, 250);
});