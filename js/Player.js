/**
 * Created by Anthony Fusco on 27/02/2017.
 */
// using functional inheritance
function Player(x, y, canvasWidth, canvasHeight, anim) {

    let vx = 0;
    let XSPEED = 750;
    let YSPEED = 500;
    let vy = 0;
    let g = 100;
    let angle = 0.0;
    let animName = "forward";

    let getSpriteWidth = function() {
        return anim.animations[animName].width;
    };
    let getSpriteHeigth = function() {
        return anim.animations[animName].height;
    };

    let animParams = {
        currentFrame : 0,
        nbCurrentTicks : 0
    };

    let calcDistanceToMove = function(delta, speed) {
        return (speed * delta) / 1000;
    };

    //bad
    let isInWindow = function () {
        if (((x + getSpriteWidth()) > canvasWidth)) {
            x = canvasWidth - getSpriteWidth();
            vx = -vx;
            vy = 0;
        } else if (x < 0) {
            x = 0;
            vx = -vx;
            vy = 0;
        }
        if ((y + getSpriteHeigth()) >= canvasHeight) {
            y = canvasHeight - getSpriteHeigth();
            vx = 0;
            vy = 0;
        }
    };

    let move = function (inputStates, delta) {
        if (inputStates.left) {
            vx = -XSPEED;
            animName = "left";
        }
        if (inputStates.up) {
            vy = -YSPEED;
        }
        if (inputStates.right) {
            vx = XSPEED;
            animName = "right";
        }
        if (inputStates.down) {
           // vy = YSPEED;
            animName = "forward";
        }
        if (inputStates.space) {
        }
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

    let collideEngine = function (others) {
        isInWindow();
    };

    return {
        move:move, draw:draw, collideEngine:collideEngine
    };
}
