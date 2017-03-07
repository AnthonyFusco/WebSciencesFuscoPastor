//////////////////////GAME FRAMEWORK/////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init);
var anim;
function init() {
    let game = new GameFramework();
    game.start();
}

const GameFramework = function () {

    let canvas, ctx, w, h;
    let frameCount = 0;
    let lastTime;
    let fpsContainer;
    let fps;

    let inputStates = {};

    function animate(time) {
        ctx.clearRect(0, 0, w, h);
        //anim.renderMoving("avancer", ctx, 100, 100, 1);

        monsters.forEach(function (monster) {
            monster.draw(ctx);
            monster.collideEngine(monsters);
            monster.move(inputStates);
        });
    }

    const measureFPS = function (newTime) {
        // test for the very first invocation
        if (lastTime === undefined) {
            lastTime = newTime;
            return;
        }
        // calculate the delta between last & current frame
        const diffTime = newTime - lastTime;
        if (diffTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }
        // and display it in an element we appended to the
        // document in the start() function
        fpsContainer.innerHTML = 'FPS: ' + fps;
        frameCount++;
    };

    const mainLoop = function (time) {
        measureFPS(time);
        animate(time);
        requestAnimationFrame(mainLoop);
    };

    const start = function () {
        console.log("loaded");

        canvas = document.querySelector("#myCanvas");
        ctx = canvas.getContext("2d");
        w = canvas.width;
        h = canvas.height;

        //create all the monsters
        initMonsters(w, h);

        //add the listener to the main, window object, and update the states
        window.addEventListener('keydown', function(event){
            if (event.keyCode === 37) {
                inputStates.left = true;
            } else if (event.keyCode === 38) {
                inputStates.up = true;
            } else if (event.keyCode === 39) {
                inputStates.right = true;
            } else if (event.keyCode === 40) {
                inputStates.down = true;
            }  else if (event.keyCode === 32) {
                inputStates.space = true;
            }
        }, false);

        //if the key will be released, change the states object
        window.addEventListener('keyup', function(event){
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


        //anim = new Animation("woman");
        requestAnimationFrame(mainLoop);
    };

    return {
        start: start
    };
};

function initMonsters(w, h) {
    for (let i = 0; i < nbMonsters; i++) {
        monsters.push(Monster(i * 100, i * 100, `rgb(${1},${1},${i * 30})`, 100, 100, w, h))
    }
}

let nbMonsters = 10;
const monsters = [];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
