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
    let inputStates = { right: false, left:false, up:false, down:false, space:false };

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
        }
        if (playerOverlap(rightFace) && rightFace.isValid(y, getSpriteHeight())) {
            x = rightFace.onCollide();
            grounded = true;
            vx = 0;
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
       /* x += calcDistanceToMove(delta, vx);
        y += calcDistanceToMove(delta, vy);*/
        checkCorrectMovement(calcDistanceToMove(delta, vx), calcDistanceToMove(delta, vy), objects)
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
        move: move, draw: draw, collideEngine: collideEngine, inputStates:inputStates
    };
}
