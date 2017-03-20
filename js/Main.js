//////////////////////GAME FRAMEWORK////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init);
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
let animations = [];
let socket;
let game;
let username;
function initSocket(username) {
    //let socket = io.connect('http://192.168.43.158:8082');
    // let socket = io.connect('http://192.168.43.3:8082');
     //let socket = io.connect('http://127.0.0.1:8082');
    let socket = io.connect('http://192.168.43.38:8082');

    socket.on('connect', function () {
        socket.emit('adduser', username);
    });

    socket.on('startgame', function (listPlayers) {
        document.getElementById('button-restart').style.display = 'none';
        game.initPlayers(listPlayers);
        game.start();
    });

    socket.on('updatechat', function (username, data) {
        let ul = document.querySelector(".chat");
        let li = document.createElement("li");
        li.innerHTML =
            `<div class="from">${username} :</div><div class="message">${data}</div>`;
        ul.appendChild(li);
    });

    socket.on('endgame', function(loosername){
        document.getElementById('button-restart').style.display = 'initial';
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

Array.prototype.binarySearch = function (find, comparator) {
    let option_high;
    let option_low;
    let low = 0, high = this.length - 1, i, comparison, prev_comparison;
    while (low <= high) {
        i = Math.floor((low + high) / 2);
        comparison = comparator(this[i], find);
        prev_comparison = comparison;
        if (comparison < 0) {
            low = i + 1;
            continue;
        }
        if (comparison > 0) {
            high = i - 1;
            continue;
        }
        break;
        /*option_high = i;
         option_low = i;
         return {option_low, option_high};*/
    }
    if (prev_comparison < 0) {
        option_low = i;
        option_high = i + 1;
    } else {
        option_low = i - 1;
        option_high = i;
    }
    return {option_low, option_high};
};
function compareLow(a, b) {
    if (a.x < b) {
        if (a.x + a.width < b) {
            return -1;
        }
        else if (a.x + a.width > b) {
            return 0;
        } else {
            return 0;
        }
    } else if (a.x > b) {
        return 1;
    } else {
        return 0;
    }
}
function compareHigh(a, b) {
    return a.x - b;
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
    /*sceneObjects.push(new SceneObject(0, 500, 500, 100));
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
     sceneObjects.push(new SceneObject(1500, 800, 10, 200));*/
    sceneObjects.push(new SceneObject(1000, 500, 100, 100));
    sceneObjects.push(new SceneObject(1100, 500, 100, 100));
    sceneObjects.push(new SceneObject(1200, 500, 100, 100));
    sceneObjects.sort(function (a, b) {
        return a.x - b.x
    });

    function animate(delta) {
        ctx.clearRect(0, 0, w, h);

        sceneObjects.forEach(function (obj) {
            obj.draw(ctx);
        });

        for (let player in players) {
            let bullets = players[player].bullets;
            let otherBullets = [];
            for(let other in players) {
                otherBullets = otherBullets.concat(players[other].bullets);
            }
            bullets.forEach(function (obj) {
                obj.draw(ctx);
                obj.isInWindow();
                obj.move(delta);
            });

            //remove the bullets
            for(let i = 0; i < bullets.length; i++) {
                if(bullets[i].isOut()){
                    bullets.splice(i, 1);
                }
            }

            players[player].draw(ctx);
            players[player].collideEngine(sceneObjects, otherBullets, player);
            players[player].move(delta, sceneObjects);
        }
    }

    function initPlayers(playernames) {
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

    const sendKeyboardEvent = function (event, boolean) {
        socket.emit('keyboardevent', event, boolean);
    };

    const start = function () {
        console.log("loaded");
        socket.on('keyboardevent', function (usernameServer, event, boolean) {
            if (usernameServer !== username) {
                if (event === 37) {
                    players[usernameServer].inputStates.left = boolean;
                } else if (event === 38) {
                    players[usernameServer].inputStates.up = boolean;
                } else if (event === 39) {
                    players[usernameServer].inputStates.right = boolean;
                } else if (event === 40) {
                    players[usernameServer].inputStates.down = boolean;
                } else if (event === 32) {
                    players[usernameServer].inputStates.space = boolean;
                }
            }
        });

        socket.on("givemecoords", function () {
            socket.emit("givemecoords", players[username].getCoords());
        });

        socket.on("setcoords", function (usernameServer, coords) {
            if (usernameServer !== username) {
                players[usernameServer].setCoords(coords.x, coords.y/*, coords.vx, coords.vy*/);
            }
        });

        socket.on("playerShooted", function(username, life){
            players[username].setLife(life);
            if (life <= 0){
                socket.emit('endgame', username);
            }
        });

        socket.on("newBullet", function(serverUsername, data){
            players[serverUsername].bullets.push(new Bullet(data.x, data.y, data.mousePosX, data.mousePosY, w, h, serverUsername));
        });
        //add the listener to the main, window object, and update the states
        window.addEventListener('keydown', function (event) {
            if (event.keyCode === 37 && !players[username].inputStates.left) {
                players[username].inputStates.left = true;
                sendKeyboardEvent(event.keyCode, true);
            } else if (event.keyCode === 38 && !players[username].inputStates.up) {
                players[username].inputStates.up = true;
                sendKeyboardEvent(event.keyCode, true);
            } else if (event.keyCode === 39 && !players[username].inputStates.right) {
                players[username].inputStates.right = true;
                sendKeyboardEvent(event.keyCode, true);
            } else if (event.keyCode === 40 && !players[username].inputStates.down) {
                players[username].inputStates.right = true;
                sendKeyboardEvent(event.keyCode, true);
            } else if (event.keyCode === 32 && !players[username].inputStates.space) {
                players[username].inputStates.space = true;
                sendKeyboardEvent(event.keyCode, true);
            }
        }, false);

        //if the key will be released, change the states object
        window.addEventListener('keyup', function (event) {
            if (event.keyCode === 37 && players[username].inputStates.left) {
                players[username].inputStates.left = false;
            } else if (event.keyCode === 38 && players[username].inputStates.up) {
                players[username].inputStates.up = false;
            } else if (event.keyCode === 39 && players[username].inputStates.right) {
                players[username].inputStates.right = false;
            } else if (event.keyCode === 40 && players[username].inputStates.down) {
                players[username].inputStates.down = false;
            } else if (event.keyCode === 32 && players[username].inputStates.space) {
                players[username].inputStates.space = false;
            }
            sendKeyboardEvent(event.keyCode, false);
        }, false);

        canvas.addEventListener('mousedown', function (evt) {
            players[username].inputStates.mousedown = true;
            //players[username].inputStates.mouseButton = evt.button;
        }, false);
        canvas.addEventListener('mouseup', function (evt) {
            players[username].inputStates.mousedown = false;
            //let rect = canvas.getBoundingClientRect();
            let bullet = players[username].onShoot(evt.clientX, evt.clientY);
            socket.emit("shoot", bullet.data);
        }, false);

        canvas.addEventListener('drag', function(evt){}, false);

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
