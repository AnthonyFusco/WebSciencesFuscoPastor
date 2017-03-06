function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function Animation(img) {
    var animations = {};

    var initSprites = function(data) {
        var i = 0;
        data.animations.forEach(animation => {
            var yLineForCurrentDir = i * animation.height;
            var sprite = new Sprite(spritesheet, 0, yLineForCurrentDir,
                animation.width, animation.height,
                animation.nbFrames,
                3); // draw every 1s
            animations[animation.nom] = sprite;
            i++;
        });
    }


    var spritesheet = new Image();
    spritesheet.src = `./sprites/${img}.png`;

    spritesheet.onload = function() {
        readTextFile(`./sprites/${img}.json`, function(text){
            var data = JSON.parse(text);
            initSprites(data);
        });
    };

    var renderMoving = function(nom, ctx, x, y, scale){
        if (typeof animations[nom] !== "undefined"){
            animations[nom].renderMoving(ctx, x, y, scale)
        }
    }

    var render = function (nom, ctx, x, y, scale){
        if (typeof animations[nom] !== "undefined"){
            animations[nom].render(ctx, x, y, scale);
        }
    }

    return { animations : animations, renderMoving : renderMoving, render : render };


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