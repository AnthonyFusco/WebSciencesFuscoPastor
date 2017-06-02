//////////////////////GAME FRAMEWORK////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init);
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
let animations = [];
let textures = [];
let socket;
let game;
let username;
let gameRunning = false;

function initSocket() {
    //let socket = io.connect('http://192.168.43.158:8082');
     //let socket = io.connect('http://192.168.43.3:8082');
     let socket = io.connect('http://127.0.0.1:8082');
    //let socket = io.connect('http://192.168.43.38:8082');
    socket.on('yourname', function(name){
        username = name;
    });
    socket.on('connect', function () {
        socket.emit('adduser');
    });

    socket.on('startgame', function (listPlayers) {
        game.initPlayers(listPlayers);
        gameRunning = true;
    });

    socket.on('updatechat', function (username, data) {
        let ul = document.querySelector(".chat");
        let li = document.createElement("li");
        li.innerHTML =
            `<div class="from">${username} :</div><div class="message">${data}</div>`;
        ul.appendChild(li);
    });

    socket.on('endgame', function (loosername) {
        for(let player in game.players){
            game.players[player].setLife(0);
        }
        gameRunning = false;
        game.getMenu().generate('endgame', loosername);
        game.getMenu().setShowed(true);
    });

    let data = document.querySelector("#input-message");
    data.addEventListener("keypress", function (evt) {
        if (evt.keyCode == 13) {
            this.blur();
            sendMessage();
        }
    });

    function sendMessage() {
        let message = data.value;
        data.value = "";
        socket.emit('sendchat', message);
    }

    function restartGame(){
        socket.emit('iwantrestart');
    }

    socket.sendMessage = sendMessage;
    socket.restartGame = restartGame;
    return socket;
}

function init() {
    textures.push(new TextureSet("metalTexture.jpg"), new TextureSet("lava.png"), new TextureSet("night.jpg"),
        new TextureSet("blockstone.jpg"), new TextureSet('arrow.png'), new TextureSet('sky.jpg'), new TextureSet('crosshair.png'));
    animations.push(new AnimationsSet("archer"));

    let texturePromesses = textures.map(function (texture) {
        return texture.getRequest();
    });

    let promesses = animations.map(function (animation) {
        return animation.getRequest();
    });

    promesses.concat(texturePromesses);

    Promise.all(promesses).then(() => {
        socket = initSocket();
        game = new GameFramework(socket);
        game.start();
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
