function readTextFile(file, callback) {
    return new Promise(function(resolve, reject){
        fetch(file)
            .then((response) => {
                return response.json();
            })
            .then(function(json) {
                callback(json);
            })});
}

function Animation(img) {
    var animations = {};
    var initSprites = function(data, spritesheet) {
        var i = 0;
        data.animations.forEach(animation => {
            var yLineForCurrentDir = i * animation.height;
            var sprite = new Sprite(spritesheet, 0, yLineForCurrentDir,
                animation.width, animation.height,
                animation.nbFrames,
                animation.nbTicksBetweenRedraws); // draw every 1s
            animations[animation.nom] = sprite;
            i++;
        });
    }

    var request = new Promise(function(resolve, reject){
        var spritesheet = new Image();
        spritesheet.onload = function() {
            readTextFile(`./sprites/${img}.json`, function(json){
                initSprites(json, spritesheet);
                resolve();
            });
        };
        spritesheet.src = `./sprites/${img}.png`;
    });

    /*var getWidth = function(nom){
        return animations[nom].width;
    }

    var getHeight = function(nom){
        return animations[nom].height;
    }*/


    var renderMoving = function(nom, ctx, x, y, scale){
        animations[nom].renderMoving(ctx, x, y, scale)
    }

    var render = function (nom, ctx, x, y, scale){
        animations[nom].render(ctx, x, y, scale);
    }

    var getRequest = function(){
        return request;
    }

    return { animations : animations, renderMoving : renderMoving, render : render, getRequest:getRequest/*, getHeight:getHeight, getWidth:getWidth*/ };


}




function SpriteImage(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.render = function(ctx, xPos, yPos) {
        ctx.drawImage(this.img,
            this.x, this.y,
            this.width, this.height,
            xPos, yPos,
            this.width, this.height);
    };
}

function Sprite(spritesheet, x, y, width, height, nbImages, nbFramesOfAnimationBetweenRedraws) {
    this.spriteImages = [];
    this.currentFrame = 0;
    this.nbFrames = nbImages;
    this.nbTicksBetweenRedraws = nbFramesOfAnimationBetweenRedraws;
    this.nbCurrentTicks=0;
    this.width = width;
    this.height = height;

    for(var i = 0; i < nbImages; i++) {
        this.spriteImages[i] = new SpriteImage(spritesheet, x + i * width, y, width, height);
    }

    this.renderMoving = function(ctx, x, y, scale) {
        this.spriteImages[this.currentFrame].render(ctx, x, y, scale);
        this.nbCurrentTicks++;
        if(this.nbCurrentTicks > this.nbTicksBetweenRedraws) {
            this.currentFrame++;
            if(this.currentFrame == this.nbFrames) {
                this.currentFrame=0;
            }
            this.nbCurrentTicks = 0;
        }
    };
    this.render = function(ctx, x, y, scale) {
        this.spriteImages[0].render(ctx, x, y, scale);
    };
}