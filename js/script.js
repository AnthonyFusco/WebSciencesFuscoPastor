//////////////////////GAME FRAMEWORK/////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init);

const GameFramework = function () {

    let canvas, ctx, w, h;
    let frameCount = 0;
    let lastTime;
    let fpsContainer;
    let fps;

    function animate(time) {
        ctx.clearRect(0, 0, w, h);

        monsters.forEach(function (monster) {
            monster.draw(ctx);
            monster.collideEngine(monsters);
            monster.move();
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
        /*
         var img = new Image();
         img.onerror = mainLoop;
         img.src = 'data:image/png,' + Math.random();
         */
    };

    const start = function () {
        console.log("loaded");

        canvas = document.querySelector("#myCanvas");
        ctx = canvas.getContext("2d");
        w = canvas.width;
        h = canvas.height;

        //create all the monsters
        initMonsters(w, h);

        /**
         * at mousedown event, check if a monster is selected
         */
        canvas.addEventListener('mousedown', function (event) {
            for (let i = nbMonsters - 1; i >= 0; i--) { // the object in first plan is the last if the list, so check the reverse of the list
                if (mouseSelect(event, monsters[i])) break; // break when we found one
            }
        });

        /**
         * at mouseup event, apply gravity and give the object the speed of the mouse
         */
        window.addEventListener('mouseup', function (event) {
            for (let i = 0; i < nbMonsters; i++) {
                if(monsters[i].onSelection()) break;
            }
        });

        /**
         * at mousemove event, apply the drag to the object
         * Note: done wrong, we loop through all the objects when only one can be dragged.
         * The object currently selected should be known by a gameEngine instead of a variable in every object
         */
        canvas.addEventListener('mousemove', function (event) {
            for (let i = 0; i < nbMonsters; i++) {
                if (monsters[i].mouseDrag(event)) break;
            }
        });
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
        requestAnimationFrame(mainLoop);
    };

    return {
        start: start
    };
};

function init() {
    let game = new GameFramework();
    game.start();
}

/**
 * doesn't work
 * returns true if two monster are collided
 * Note: could be generalised for the mouse selection ?
 * @param monster
 * @param other
 * @returns {boolean}
 */
function isCollide(monster, other) {
    const dx = monster.x - other.x;
    const dy = monster.y - other.y;
    return ((dx * dx + dy * dy) < (monster.w + other.w) * (monster.w + other.w));
}

/**
 * check if the mouse is in an object
 * @param event
 * @param monster
 * @returns {boolean|*}
 */
function mouseSelect(event, monster) {
    monster.isSelect = (event.x > monster.x && event.x < monster.w + monster.x) && (event.y > monster.y && event.y < monster.h + monster.y);
    if (monster.isSelect) monster.g = 0;
    return monster.isSelect;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initMonsters(w, h) {
    for (let i = 0; i < nbMonsters; i++) {
        monsters.push(Monster(i * 100, i * 100, `rgb(${1},${1},${i * 30})`, 100, 100, w, h))
    }
}

let nbMonsters = 10;
const monsters = [];

// for example
const MonstreSingletonObject = function (x, y, color, mw, mh) {
    return {
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        g: 10,
        mouseSpeedX: 0.0,
        mouseSpeedY: 0.0,
        isSelect: false,
        angle: 0.0,
        color: color,
        w: mw,
        h: mh,
        move: function () {
            this.x += this.vx;
            this.y += this.vy;
        },
        draw: function (ctx) {
            // Bonne pratique : on sauve le contexte au début
            // on le restaure
            ctx.save();

            // bonne pratique
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            // couleur en CSS3
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, this.w, this.h);
            ctx.fillRect(0, 0, this.w, this.h);


            ctx.restore();
        },
        isIn: function (others) {
            if (((this.x + this.w) > w)) {
                this.x = w - this.w;
                this.vx = -this.vx;
                this.vy = 0;
            } else if (this.x < 0) {
                this.x = 0;
                this.vx = -this.vx;
                this.vy = 0;
            }
            if ((this.y + this.h) >= h) {
                this.y = h - this.h;
                this.vx = 0;
                this.vy = 0;
            }

            others.forEach(function (other) {
                if (isCollide(this, other)) {
                    this.vx = 0;
                    this.vy = 0;
                }
            });
        },
        mouseDrag: function (event) {
            if (this.isSelect) {
                // var rect = canvas.getBoundingClientRect();
                this.x = event.x - this.w / 2;
                this.y = event.y - this.h / 2;
                this.mouseSpeedX = event.movementX;
                this.mouseSpeedY = event.movementY;
            }

        }
    }
};





