/**
 * Created by Anthony Fusco on 27/02/2017.
 */
// using functional inheritance
function Player(x, y, canvasWidth, canvasHeight, anim) {

    let vx = 0;
    let XSPEED = 500;
    let YSPEED = 1000;
    let vy = 0;
    let g = 100;
    let angle = 0.0;
    let animName = "forward";
    let grounded = false;

    let getSpriteWidth = function () {
        return anim.animations[animName].width;
    };
    let getSpriteHeight = function () {
        return anim.animations[animName].height;
    };

    let animParams = {
        currentFrame: 0,
        nbCurrentTicks: 0
    };

    let calcDistanceToMove = function (delta, speed) {
        return (speed * delta) / 1000;
    };

    let isInWindow = function () {
        if ((x + getSpriteWidth()) > canvasWidth) {
            x = canvasWidth - getSpriteWidth();
            vx = -vx;
            vy = 0;
            grounded = true;
        } else if (x < 0) {
            x = 0;
            vx = -vx;
            vy = 0;
            grounded = true;
        }
        if ((y + getSpriteHeight()) >= canvasHeight) {
            y = canvasHeight - getSpriteHeight();
            vx = 0;
            vy = 0;
            grounded = true;
        }
    };

    function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !((x1 > (x2 + w2)) || ((x1 + w1) < x2)) && !((y1 > (y2 + h2)) || ((y1 + h1) < y2));
    }

    function playerOverlap(object) {
        //todo height and width of the sprites ?
        return rectsOverlap(x, y, getSpriteWidth(), getSpriteHeight(), object.x, object.y, object.width, object.height);
    }

    function onPlayerOverlap(objects) {
        objects.forEach(function (obj) {
            if (playerOverlap(obj)) {
                let topFace    = obj.faces["topFace"];
                let bottomFace = obj.faces["bottomFace"];
                let leftFace   = obj.faces["leftFace"];
                let rightFace  = obj.faces["rightFace"];
                if(playerOverlap(topFace) && topFace.isValid(x, getSpriteWidth())) {
                    y = topFace.onCollide(getSpriteHeight());
                    grounded = true;
                    vx = 0;
                    vy = 0;
                }
                if(playerOverlap(bottomFace) && bottomFace.isValid(x, getSpriteWidth())) {
                   y = bottomFace.onCollide();
                    grounded = true;
                    vx = 0;
                    vy = 0;
                }
                if(playerOverlap(leftFace) && leftFace.isValid(y, getSpriteHeight())) {
                    x = leftFace.onCollide(getSpriteWidth());
                    grounded = true;
                    vx = 0;
                }
                if(playerOverlap(rightFace) && rightFace.isValid(y, getSpriteHeight())) {
                    x = rightFace.onCollide();
                    grounded = true;
                    vx = 0;
                }
            }
        });
    }

    let move = function (inputStates, delta) {
        if (inputStates.left) {
            vx = -XSPEED;
            animName = "left";
        }
        if (inputStates.up) {
            vy = -YSPEED;
            grounded = false;
        }
        if (inputStates.right) {
            vx = XSPEED;
            animName = "right";
        }
        if (inputStates.down) {
            animName = "forward";
        }
        if (inputStates.space) {
        }
        /*if(!inputStates.left && !inputStates.right) {
            vx = 0;
        }*/
        vy += g;
        x += calcDistanceToMove(delta, vx);
        y += calcDistanceToMove(delta, vy);
    };

    let draw = function (ctx) {
        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(angle);

        if (vx == 0) {
            anim.render(animName, ctx, 0, 0, 1);
        } else {
            anim.renderMoving(animName, ctx, 0, 0, 1, animParams);
        }
        ctx.restore();
    };

    let collideEngine = function (objects) {
        isInWindow();
        onPlayerOverlap(objects);
    };

    return {
        move: move, draw: draw, collideEngine: collideEngine
    };
}
