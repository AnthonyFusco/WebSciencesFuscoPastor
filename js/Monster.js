/**
 * Created by Anthony Fusco on 27/02/2017.
 */
// using functional inheritance
function Monster(x, y, color, mw, mh, w, h) {
    let api = {};

    api.x = x;
    api.y = y;
    api.vx = 0;
    api.vy = 0;
    api.g = 10;
    api.mouseSpeedX = 0.0;
    api.mouseSpeedY = 0.0;
    api.isSelect = false;
    api.angle = 0.0;
    api.color = color;
    api.w = mw;
    api.h = mh;

    //bad
    const isInWindow = function () {
        if (((api.x + api.w) > w)) {
            api.x = w - api.w;
            api.vx = -api.vx;
            api.vy = 0;
        } else if (api.x < 0) {
            api.x = 0;
            api.vx = -api.vx;
            api.vy = 0;
        }
        if ((api.y + api.h) >= h) {
            api.y = h - api.h;
            api.vx = 0;
            api.vy = 0;
        }
    };

    api.move = function (inputStates, ctx) {
        if (inputStates.left) {
            api.vx = -10;
        }
        if (inputStates.up) {
            api.vy = -50;
        }
        if (inputStates.right) {
            api.vx = 10;
        }
        if (inputStates.down) {
           // api.vy = 50;
        }
        if (inputStates.space) {
        }
        api.vy += api.g;
        api.x += api.vx;
        api.y += api.vy;
    };
    api.draw = function (ctx) {
        // Bonne pratique : on sauve le contexte au début
        // on le restaure
        ctx.save();

        // bonne pratique
        ctx.translate(api.x, api.y);
        ctx.rotate(api.angle);

        // couleur en CSS3
        ctx.fillStyle = api.color;
        ctx.fillRect(0, 0, api.w, api.h);
        ctx.fillRect(0, 0, api.w, api.h);

        ctx.restore();
    };
    api.collideEngine = function (others) {
        isInWindow();
    };

    return api;
}
