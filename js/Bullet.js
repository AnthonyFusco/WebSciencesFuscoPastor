/**
 * Created by Anthony Fusco on 15/03/2017.
 */

function Bullet(x, y, mousePosX, mousePosY, canvasWidth, canvasHeight, username) {

    let lastX = x;
    let lastY = y;
    let width = 65;
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
    let data = {x, y, mousePosX, mousePosY, username};

    let draw = function (ctx) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI);
        ctx.drawImage(textures[4].textureImage,
            0, 0,
            width, height);
        ctx.restore();
    };

    let move = function (delta) {
        //vy +- = g;
        lastX = x;
        lastY = y;
        x -= calcDistanceToMove(delta, vx)*Math.cos(angle);
        y -= calcDistanceToMove(delta, vy)*Math.sin(angle);
    };

    let isInWindow = function () {
        if((x + width) > canvasWidth || x < 0 || (y + height) >= canvasHeight || y > canvasHeight) {
            out = true;
        }
    };

    let isOut = function() {
        return out;
    };

    let setOut = function(bool) {
        out = bool;
    };

    let calcDistanceToMove = function (delta, speed) {
        return (speed * delta) / 1000;
    };

    let getX = function() {
        return x;
    };

    let getY = function() {
        return y;
    };

    let getLastX = function() {
        return lastX;
    };

    let getLastY = function() {
        return lastY;
    };

    let getWidth = function() {
        return width;
    };

    let getHeight = function() {
        return height;
    };

    let setWidth = function(w) {
        width = w;
    };

    let setHeight = function(h) {
        height = h;
    };

    function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !((x1 > (x2 + w2)) || ((x1 + w1) < x2)) && !((y1 > (y2 + h2)) || ((y1 + h1) < y2));
    }

    function bulletOverlap(object) {
        return rectsOverlap(x, y, lastX - x, lastY - y, object.x, object.y, object.width, object.height);
    }

    function collideOnWall(objects) {
        for (let i = 0; i < objects.length; i++) {
            let obj = objects[i];
            if (bulletOverlap(obj)) {
                setOut(true);
            }
        }
    }

    return {
        draw:draw, move:move, isInWindow:isInWindow, isOut:isOut, setOut:setOut, data:data, getX:getX, getY:getY, getWidth:getWidth, getHeight:getHeight, getLastX:getLastX, getLastY:getLastY,
        setWidth:setWidth, setHeight:setHeight, collideOnWall:collideOnWall
    };
}
