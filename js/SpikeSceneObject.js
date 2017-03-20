function SpikeSceneObject(x, y, width, height){

    let draw = function (ctx) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    };
    return {x: x, y: y, width: width, height: height, draw: draw}
}