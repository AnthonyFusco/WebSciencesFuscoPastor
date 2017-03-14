//////////////////////GAME FRAMEWORK////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init);
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
let animations = [];
let socket;
let game;
let username;

function initSocket(username){
    var socket = io.connect('http://192.168.43.3:8082');

    socket.on('connect', function(){
        socket.emit('adduser', username);
    });

    socket.on('startgame', function(listPlayers){
        game.initPlayers(listPlayers);
        game.start();
    });

    socket.on('updatechat', function (username, data) {
        var ul = document.querySelector(".chat");
        var li = document.createElement("li");
        li.innerHTML =
            `<div class="from">${username} :</div><div class="message">${data}</div>`;
        ul.appendChild(li);
    });

    var data = document.querySelector("#input-message");
    data.addEventListener("keypress", function(evt) {
        if(evt.keyCode == 13) {
            this.blur();
            sendMessage();
        }
    });

    function sendMessage() {
        var message = data.value;
        data.value = "";
        socket.emit('sendchat', message);
    }

    socket.sendMessage = sendMessage;

    return socket;
}

function init() {

    animations.push(new AnimationsSet("woman"));

    let promesses = animations.map(function (animation) {
        return animation.getRequest();
    });

    Promise.all(promesses).then(() => {
        username = prompt("What's your name?");
        socket = initSocket(username);
        game = new GameFramework();
    })
}

const GameFramework = function () {

    let canvas = document.querySelector("#myCanvas");
    let ctx = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;
    let frameCount = 0;
    let lastTime;
    let fpsContainer;
    let fps;
    let oldTime = 0;
    let players = {};

    let sceneObjects = [];
    for (let i = 0; i < 10; i++) {
        sceneObjects.push(new SceneObject(i * 100, i * 100, 100, 100))
    }
    sceneObjects.push(new SceneObject(0, 500, 500, 100));
    sceneObjects.push(new SceneObject(50, 500, 500, 100));
    sceneObjects.push(new SceneObject(100, 500, 500, 100));
    sceneObjects.push(new SceneObject(1000, 500, 500, 100));
    sceneObjects.push(new SceneObject(1000, 450, 10, 10));
    sceneObjects.push(new SceneObject(1050, 450, 10, 10));
    sceneObjects.push(new SceneObject(1100, 450, 10, 10));
    sceneObjects.push(new SceneObject(1150, 450, 10, 10));
    sceneObjects.push(new SceneObject(1200, 450, 20, 20));
    sceneObjects.push(new SceneObject(1250, 450, 10, 50));
    sceneObjects.push(new SceneObject(1300, 450, 50, 10));
    sceneObjects.push(new SceneObject(1400, 450, 20, 20));
    sceneObjects.push(new SceneObject(1450, 450, 30, 20));
    sceneObjects.push(new SceneObject(1600, 0, 30, 2000));
    sceneObjects.push(new SceneObject(1400, 875, 10, 10));
    sceneObjects.push(new SceneObject(1350, 875, 10, 10));
    sceneObjects.push(new SceneObject(1250, 875, 10, 10));
    sceneObjects.push(new SceneObject(1500, 800, 10, 200));
    sceneObjects.sort(function(a, b){return a.x - b.x});



    function animate(delta) {
        ctx.clearRect(0, 0, w, h);

        sceneObjects.forEach(function (obj) {
            obj.draw(ctx);
        });

        for (var player in players){
            players[player].draw(ctx);
            players[player].collideEngine(sceneObjects);
            players[player].move(delta);
        }


    }

    function initPlayers(playernames){
        playernames.forEach(name => players[name] = new Player(1000, 100, w, h, animations[0]));
    }

    const measureFPS = function (newTime) {
        if (lastTime === undefined) {
            lastTime = newTime;
            return;
        }
        const diffTime = newTime - lastTime;
        if (diffTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }
        fpsContainer.innerHTML = 'FPS: ' + fps;
        frameCount++;
    };

    function timer(currentTime) {
        let delta = currentTime - oldTime;
        oldTime = currentTime;
        return delta;
    }

    const mainLoop = function (time) {
        measureFPS(time);
        // number of ms since last frame draw
        let delta = timer(time);
        animate(delta);
        requestAnimationFrame(mainLoop);
    };

    const sendKeyboardEvent = function(username, event, boolean){
        socket.emit('keyboardevent', username, event, boolean);
    };

    const start = function () {
        console.log("loaded");
        socket.on('keyboardevent', function(username, event, boolean){
            debugger;
            if (event === 37) {
                players[username].inputStates.left = boolean;
            } else if (event === 38) {
                players[username].inputStates.up = boolean;
            } else if (event === 39) {
                players[username].inputStates.right = boolean;
            } else if (event === 40) {
                players[username].inputStates.down = boolean;
            } else if (event === 32) {
                players[username].inputStates.space = boolean;
            }
        });
        //add the listener to the main, window object, and update the states
        window.addEventListener('keydown', function (event) {
            if (event.keyCode === 37 && !players[username].inputStates.left) {
                sendKeyboardEvent(username, event.keyCode, true);
            } else if (event.keyCode === 38 && !players[username].inputStates.up) {
                sendKeyboardEvent(username, event.keyCode, true);
            } else if (event.keyCode === 39 && !players[username].inputStates.right) {
                sendKeyboardEvent(username, event.keyCode, true);
            } else if (event.keyCode === 40 && !players[username].inputStates.down) {
                sendKeyboardEvent(username, event.keyCode, true);
            } else if (event.keyCode === 32 && !players[username].inputStates.space) {
                sendKeyboardEvent(username, event.keyCode, true);
            }
        }, false);

        //if the key will be released, change the states object
        window.addEventListener('keyup', function (event) {
            /*if (event.keyCode === 37 && players[username].inputStates.left) {
                sendKeyboardEvent(username, event.keyCode, false);
            } else if (event.keyCode === 38 && players[username].inputStates.up) {
                sendKeyboardEvent(username, event.keyCode, false);
            } else if (event.keyCode === 39 && players[username].inputStates.right) {
                sendKeyboardEvent(username, event.keyCode, false);
            } else if (event.keyCode === 40 && players[username].inputStates.down) {
                sendKeyboardEvent(username, event.keyCode, false);
            } else if (event.keyCode === 32 && players[username].inputStates.space) {
                sendKeyboardEvent(username, event.keyCode, false);
            }*/
            sendKeyboardEvent(username, event.keyCode, false);
        }, false);

        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);

        requestAnimationFrame(mainLoop);
    };

    return {
        start: start,
        initPlayers: initPlayers
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
