//////////////////////GAME FRAMEWORK////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init);
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
let animations = [];
function init() {
    let game = new GameFramework();

    animations.push(new AnimationsSet("woman"));

    let promesses = animations.map(function (animation) {
        return animation.getRequest();
    });

    Promise.all(promesses).then(() => {
        game.start();
    })
}

const GameFramework = function () {

    let canvas, ctx, w, h;
    let frameCount = 0;
    let lastTime;
    let fpsContainer;
    let fps;
    let oldTime = 0;

    let inputStates = {};

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

        players.forEach(function (player) {
            player.draw(ctx);
            player.collideEngine(sceneObjects);
            player.move(inputStates, delta);
        });
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

    const start = function () {
        console.log("loaded");

        canvas = document.querySelector("#myCanvas");
        ctx = canvas.getContext("2d");
        w = canvas.width;
        h = canvas.height;

        //create all the players
        initPlayers(w, h);

        //add the listener to the main, window object, and update the states
        window.addEventListener('keydown', function (event) {
            if (event.keyCode === 37) {
                inputStates.left = true;
            } else if (event.keyCode === 38) {
                inputStates.up = true;
            } else if (event.keyCode === 39) {
                inputStates.right = true;
            } else if (event.keyCode === 40) {
                inputStates.down = true;
            } else if (event.keyCode === 32) {
                inputStates.space = true;
            }
        }, false);

        //if the key will be released, change the states object
        window.addEventListener('keyup', function (event) {
            if (event.keyCode === 37) {
                inputStates.left = false;
            } else if (event.keyCode === 38) {
                inputStates.up = false;
            } else if (event.keyCode === 39) {
                inputStates.right = false;
            } else if (event.keyCode === 40) {
                inputStates.down = false;
            } else if (event.keyCode === 32) {
                inputStates.space = false;
            }
        }, false);

        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);

        requestAnimationFrame(mainLoop);
    };

    return {
        start: start
    };
};

function initPlayers(w, h) {
    for (let i = 0; i < nbPlayers; i++) {
        players.push(Player(1000, 100, w, h, animations[0]))
    }
}

let nbPlayers = 1;
const players = [];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
