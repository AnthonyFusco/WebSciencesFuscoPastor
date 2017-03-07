function AnimationsSet(img) {
    let animations = {};

    let initSprites = function(data, spritesheet) {
        data.animations.forEach(animation => {
            var yLineForCurrentDir = animation.line * animation.height;
            var sprite = new Sprite(spritesheet, 0, yLineForCurrentDir,
                animation.width, animation.height,
                animation.nbFrames,
                animation.nbTicksBetweenRedraws);
            animations[animation.nom] = sprite;
        });
    };

    let getJSONFile = function (file, callback) {
        return new Promise(function(resolve, reject){
            fetch(file)
                .then((response) => {
                    return response.json();
                })
                .then(function(json) {
                    callback(json);
                })});
    };

    let request = new Promise(function(resolve, reject){
        let spritesheet = new Image();
        spritesheet.onload = function() {
            getJSONFile(`./sprites/${img}.json`, function(json){
                initSprites(json, spritesheet);
                resolve();
            });
        };
        spritesheet.src = `./sprites/${img}.png`;
    });


    let renderMoving = function(nom, ctx, x, y, scale, owner){
        animations[nom].renderMoving(ctx, x, y, scale, owner)
    };

    let render = function (nom, ctx, x, y, scale){
        animations[nom].render(ctx, x, y, scale);
    };

    let getRequest = function(){
        return request;
    };

    return { animations : animations, renderMoving : renderMoving, render : render, getRequest:getRequest };
}


function SpriteImage(img, x, y, width, height) {
    let render = function(ctx, xPos, yPos) {
        ctx.drawImage(img,
            x, y,
            width, height,
            xPos, yPos,
            width, height);
    };
    return { render: render }
}

function Sprite(spritesheet, x, y, width, height, nbImages, nbFramesOfAnimationBetweenRedraws) {
    let spriteImages = [];


    for(var i = 0; i < nbImages; i++) {
        spriteImages[i] = new SpriteImage(spritesheet, x + i * width, y, width, height);
    }

    let renderMoving = function(ctx, x, y, scale, owner) {
        spriteImages[owner.currentFrame].render(ctx, x, y, scale);
        owner.nbCurrentTicks++;
        if(owner.nbCurrentTicks > nbFramesOfAnimationBetweenRedraws) {
            owner.currentFrame++;
            if(owner.currentFrame == nbImages) {
                owner.currentFrame = 0;
            }
            owner.nbCurrentTicks = 0;
        }
    };
    let render = function(ctx, x, y, scale) {
        spriteImages[0].render(ctx, x, y, scale);
    };

    return { width : width, height : height, renderMoving : renderMoving, render : render };
}