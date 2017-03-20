/**
 * Created by Anthony Fusco on 27/02/2017.
 */
// using functional inheritance
function Player(x, y, canvasWidth, canvasHeight, anim) {

    let vx = 0;
    let XSPEED = 300;
    let YSPEED = 500;
    let GSPEED = 100;
    let vy = 0;
    let g = GSPEED;
    let angle = 0.0;
    let animName = "forward";
    let grounded = false;
    let inputStates = {right: false, left: false, up: false, down: false, space: false, mousedown: false};
    let isMovementBlocked = true;
    let bullets = [];
    let life = 10;

    let shooted = function (bulletPower) {
        life = life - bulletPower;
        console.log("life " + life);
        socket.emit("ihavebeenshot", life);
    };

    let shoot = function (bullet) {
        //console.log("shoot");
        socket.emit("shoot", bullet.data);
    };

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
            vx = 0;
            grounded = true;
            isMovementBlocked = true;
        } else if (x < 0) {
            x = 0;
            vx = 0;
            grounded = true;
            isMovementBlocked = true;
        }
        if ((y + getSpriteHeight()) >= canvasHeight) {
            y = canvasHeight - getSpriteHeight();
            g = 0;
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
        let low = objects.binarySearch(x, compareLow).option_low;
        if (low == -1) {
            low = 0;
        }
        let high = objects.binarySearch(x + getSpriteWidth(), compareHigh).option_high;

        //console.log("low : " + low + ", high : " + high + ", x : " + x);
        for (let i = low; i < high; i++) {
            let obj = objects[i];
            if (playerOverlap(obj)) {
                onOverlap(obj);
            }
        }
    }

    let onOverlap = function (obj) {
        let topFace = obj.faces["topFace"];
        let bottomFace = obj.faces["bottomFace"];
        let leftFace = obj.faces["leftFace"];
        let rightFace = obj.faces["rightFace"];
        if (playerOverlap(topFace) && topFace.isValid(x, getSpriteWidth())) {
            y = topFace.onCollide(getSpriteHeight());
            grounded = true;
            vx = 0;
            vy = 0;
            g = 0;
        }
        if (playerOverlap(bottomFace) && bottomFace.isValid(x, getSpriteWidth())) {
            y = bottomFace.onCollide();
            grounded = true;
            vx = 0;
            vy = 0;
        }
        if (playerOverlap(leftFace) && leftFace.isValid(y, getSpriteHeight())) {
            x = leftFace.onCollide(getSpriteWidth());
            grounded = true;
            vx = 0;
            isMovementBlocked = true;
        }
        if (playerOverlap(rightFace) && rightFace.isValid(y, getSpriteHeight())) {
            x = rightFace.onCollide();
            grounded = true;
            vx = 0;
            isMovementBlocked = true;
        }
    };

    let checkCorrectMovement = function (deltaX, deltaY, objects) {
        let low = objects.binarySearch(x, compareLow).option_low;
        if (low == -1) {
            low = 0;
        }
        let high = objects.binarySearch(x + getSpriteWidth() + deltaX, compareHigh).option_high;

        for (let i = low; i < high; i++) {
            let obj = objects[i];
            let oldX = x;
            let oldY = y;
            let max;
            if (deltaX > deltaY) {
                max = Math.abs(deltaX);
            } else {
                max = Math.abs(deltaY);
            }
            while (max > 0) {
                max--;
                if (oldX != x + deltaX) {
                    oldX = oldX + Math.sign(deltaX);
                }
                if (oldY != y + deltaY) {
                    oldY = oldY + Math.sign(deltaY);
                }
                if (rectsOverlap(oldX, oldY, getSpriteWidth(), getSpriteHeight(), obj.x, obj.y, obj.width, obj.height)) {
                    x += deltaX;
                    y += deltaY;
                    onOverlap(obj);
                    return;
                }
                // if (x != oldX + deltaX) {x = x + Math.sign(deltaX);}
                // if (y != oldY + deltaY) {y = y + Math.sign(deltaY);}
                /*if (playerOverlap(obj)) {
                 onOverlap(obj);
                 return;
                 }*/
            }
        }
        x += deltaX;
        y += deltaY;
    };

    let move = function (delta, objects) {
        let isMoving = false;
        if (inputStates.up) {
            vy = -YSPEED;
            grounded = false;
            isMoving = false;
        }
        if (inputStates.left) {
            vx = -XSPEED;
            animName = "left";
            isMoving = true;
        }
        if (inputStates.right) {
            vx = XSPEED;
            animName = "right";
            isMoving = true;
        }
        if (inputStates.down) {
            animName = "forward";
            isMoving = true;
        }
        if (inputStates.space) {
        }
        /*if(!inputStates.left && !inputStates.right) {
         vx = 0;
         }*/
        vy += g;
        /* x += calcDistanceToMove(delta, vx);
         y += calcDistanceToMove(delta, vy);*/
        if (!isMoving) {
            isMovementBlocked = true;
        }
        checkCorrectMovement(calcDistanceToMove(delta, vx), calcDistanceToMove(delta, vy), objects)
    };

    let draw = function (ctx) {
        ctx.save();
        if (life > 0) {
            ctx.translate(x, y);
            ctx.rotate(angle);
            if (isMovementBlocked) {
                //if (vx == 0) {
                anim.render(animName, ctx, 0, 0, 1);
            } else {
                anim.renderMoving(animName, ctx, 0, 0, 1, animParams);
            }
        }
        ctx.restore();
    };

    function amIShoot(otherBullets, playerName) {
        //console.log("size " + otherBullets.length);
        otherBullets.forEach(function (bullet) {
            //console.log("name " + playerName +" bullet " + bullet.data.username);
            if (playerName !== bullet.data.username) {
               // let bulletCollide = bullet;
               // bulletCollide.width = bulletCollide.x - bulletCollide.lastX;
               // bulletCollide.height = bulletCollide.y - bulletCollide.lastY;
                if (playerOverlap(bullet)) {
                    shooted(1);
                    bullet.setOut(true);
                }
            }
        });
    }

    let collideEngine = function (objects, otherBullets, playerName) {
        g = GSPEED;
        isMovementBlocked = false;
        isInWindow();
        onPlayerOverlap(objects);
        amIShoot(otherBullets, playerName);
    };

    let getCoords = function () {
        return {x: x, y: y/*, vx:vx,vy:vy*/};
    };

    let setCoords = function (nx, ny/*, nvx, nvy*/) {
        x = nx;
        y = ny;
        /*vx = nvx;
         vy = nvy;*/
    };

    let onShoot = function (mousePosX, mousePosY) {
        let bullet = new Bullet(x, y, mousePosX, mousePosY, canvasWidth, canvasHeight, username);
        bullets.push(bullet);
        return bullet;
    };

    return {
        move: move,
        draw: draw,
        collideEngine: collideEngine,
        inputStates: inputStates,
        getCoords: getCoords,
        setCoords: setCoords,
        getSpriteWidth: getSpriteWidth,
        getSpriteHeight: getSpriteHeight,
        onShoot: onShoot,
        bullets: bullets
    };
}