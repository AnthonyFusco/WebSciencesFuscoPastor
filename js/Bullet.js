/**
 * Created by Anthony Fusco on 15/03/2017.
 */

function Bullet(x, y, mousePosX, mousePosY, canvasWidth, canvasHeight) {

    let width = 10;
    let height = 10;
    let XSPEED = 1000;
    let YSPEED = 10;
    let GSPEED = 10;
    let vx = XSPEED;
    let vy = XSPEED; //XSPEED !
    let g = GSPEED;
    let dx = x - mousePosX;
    let dy = y - mousePosY;
    let angle = Math.atan2(dy, dx);
    let out = false;

    let draw = function (ctx) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    };

    let move = function (delta) {
        //vy +- = g;
        x -= calcDistanceToMove(delta, vx)*Math.cos(angle);
        y -= calcDistanceToMove(delta, vy)*Math.sin(angle);
    };

    let isInWindow = function () {
       /* if ((x + width) > canvasWidth) {
            x = canvasWidth - width - 5;
            vx = 0;
        } else if (x < 0) {
            x = 0;
            vx = 0;
        }
        if ((y + height) >= canvasHeight) {
            y = canvasHeight - height - 5;
            g = 0;
            vx = 0;
            vy = 0;
        }*/
        if((x + width) > canvasWidth || x < 0 || (y + height) >= canvasHeight || y > canvasHeight) {
            out = true;
        }
    };

    let isOut = function() {
        return out;
    };

    let calcDistanceToMove = function (delta, speed) {
        return (speed * delta) / 1000;
    };

    return {
        draw:draw, move:move, isInWindow:isInWindow, isOut:isOut
    };
}
