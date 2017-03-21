class Button {
    constructor(label, x, y, width, height, callback){
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.callback = callback;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.font = `${this.height / 3}px Comic Sans MS`;
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(this.label, this.width/2, this.height/2);
        ctx.restore();
    }

    catch(event){
        let xM = event.clientX;
        let yM = event.clientY;
        return xM > this.x && xM < this.x + this.width && yM > this.y && yM < this.y + this.height;
    }

    fire(){
        this.callback();
    }
}

class Menu {
    constructor(canvas){
        this.showed = false;
        this.listButtons = [];
        this.canvas = canvas;
    }

    draw(ctx){
        ctx.save();
        this.listButtons.forEach(button => button.draw(ctx));
        ctx.restore();
    };

    isShowed(){
        return this.showed;
    }

    setShowed(boolean){
        this.showed = boolean;
    }

    onClick(event){
        this.listButtons.forEach(button => {
           if (button.catch(event)){
               button.fire();
           }
        });
    }

    generate(type, namePlayer){
        this.listButtons = [];
        switch (type){
            case 'start' :
                this.generateStart(namePlayer);
                break;
            case 'endgame' :
                this.generateEndGame(namePlayer);
        }
    }

    generateStart(namePlayer) {
        var self = this;
        let buttonStart = new Button("Start Game", this.canvas.width / 2, this.canvas.height / 2, 250, 100, function(){
            socket.emit('IWantStart');
            self.setShowed(false);
        });
        this.listButtons.push(buttonStart);
    }

    generateEndGame(namePlayer){
        var self = this;
        let buttonStart = new Button("Restart Game", this.canvas.width / 2, this.canvas.height / 2, 250, 100, function(){
            game.initPlayers(Object.keys(game.players));
            socket.emit('IWantStart');
            self.setShowed(false);
        });
        this.listButtons.push(buttonStart);
    }
}