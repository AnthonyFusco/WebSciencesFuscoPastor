class Menu {
    constructor(){
        this.showed = false;
        this.listButtons = [];
        this.listButtons.push($("#buttonStart"));
        this.canvas = $("#myCanvas");
    }


    isShowed(){
        return this.showed;
    }

    setShowed(boolean){
        this.showed = boolean;
        if (boolean){
            this.listButtons.forEach(b => b.show());
            this.canvas.css("background", "url('../sprites/MenuFond.PNG') no-repeat center center;")
        }else{
            this.listButtons.forEach(b => b.hide());
            this.canvas.css("background", "");
        }
    }
}