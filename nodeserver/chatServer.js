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
let gameRunning = false;
io.sockets.on('connection', function (socket) {
    socket.on('adduser', function(){
        socket.username = 'joueur' + (Object.keys(players).length + 1);
        socket.emit('yourname', socket.username);
        players[socket.username] = socket;
    });

    socket.on('IWantStart', function(){
       restart++;
       if (restart === nbPlayersMax){
           gameRunning = true;
           io.sockets.emit('startgame', Object.keys(players));
           restart = 0;
       }
    });

    function endGame(loosername) {
        io.sockets.emit("endgame", socket.username);
        gameRunning = false;
    }

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
        io.sockets.emit("newBullet", socket.username, data);
    });

    socket.on('iwalkedonspikes', function(){
        socket.life = 0;
        endGame(socket.username);
    });

    socket.on("endgame", function(loosername){
        sounds["scream"].play();
        endGame(loosername);
    });

    socket.on('iwantrestart', function(){
        restart++;
        if (Object.keys(players).length == restart){
            restart = 0;
            io.sockets.emit('startgame', Object.keys(players));
        }
    });

    setInterval(function(){
        if (gameRunning){
            io.sockets.emit("givemecoords");
        }
    }, 125);
});