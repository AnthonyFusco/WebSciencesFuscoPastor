class Menu {
    constructor(){
        this.showed = false;
        this.listButtons = [];
        this.listButtons.push($("#buttonStart"));
    }


    isShowed(){
        return this.showed;
    }

    setShowed(boolean){
        this.showed = boolean;
        if (boolean){
            this.listButtons.forEach(b => b.show());
        }else{
            this.listButtons.forEach(b => b.hide());
        }
    }
}