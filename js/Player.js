/**
 * Created by Anthony Fusco on 27/02/2017.
 */
// using functional inheritance
function Player(x, y, canvasWidth, canvasHeight, anim) {

    let vx = 0;
    let vy = 0;
    let g = 10;
    let angle = 0.0;
    let animName = "avancer";
    let w = anim.animations[animName].width;
    let h = anim.animations[animName].height;
    //bad
    let isInWindow = function () {
        if (((x + w) > canvasWidth)) {
            x = canvasWidth - w;
            vx = -vx;
            vy = 0;
        } else if (x < 0) {
            x = 0;
            vx = -vx;
            vy = 0;
        }
        if ((y + h) >= canvasHeight) {
            y = canvasHeight - h;
            vx = 0;
            vy = 0;
        }
    };

    let move = function (inputStates, ctx) {
        if (inputStates.left) {
            vx = -10;
        }
        if (inputStates.up) {
            vy = -50;
        }
        if (inputStates.right) {
            vx = 10;
        }
        if (inputStates.down) {
           // vy = 50;
        }
        if (inputStates.space) {
        }
        vy += g;
        x += vx;
        y += vy;
    };
    let draw = function (ctx) {
        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(angle);

       /* ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        */
        anim.renderMoving(animName, ctx, 0, 0, 1);
        ctx.restore();
    };
    let collideEngine = function (others) {
        isInWindow();
    };

    return {
        move:move, draw:draw, collideEngine:collideEngine
    };
}
