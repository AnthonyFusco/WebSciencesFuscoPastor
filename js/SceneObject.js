/**
 * Created by Anthony Fusco on 08/03/2017.
 */
/**
 * Creates a scene object knowing its position and its faces for collision purpose.
 * the faces Array give access to the 4 faces of the object called "topFace", "topFace", "leftFace" and "rightFace".
 * @param x the x position of the object (top left)
 * @param y the y position of the object (top left)
 * @param width
 * @param height
 * @returns {{x: *, y: *, width: *, height: *, faces: Array, draw: draw}}
 * @constructor
 */
function SceneObject(x, y, width, height) {

    /**
     * Builder for the faces of the SceneObject.
     * @param x
     * @param y
     * @param width
     * @param height
     * @param onCollide Place the player next the given face.
     * @param isValid Check if the player is over/under or left/right of the SceneObject we will not use the
     * left/right or top/bottom onCollide.
     * @returns {{x: *, y: *, width: *, height: *, onCollide: *, isValid: *}}
     */
    function faceBuilder(x, y, width, height, onCollide, isValid) {
        return {x: x, y: y, width: width, height: height, onCollide: onCollide, isValid: isValid}
    }

    /**
     * Check if the center of the Y position of the player is not over or under the SceneObject.
     * Used to not use the left or right collision when the player is over/under the SceneObject
     * @param playerY
     * @param playerHeight
     * @returns {boolean}
     */
    let isValidX = function (playerY, playerHeight) {
        let center = playerY + playerHeight / 2;
        return center > y && center < y + height;
    };

    let isValidY = function (playerX, playerWidth) {
        let center = playerX + playerWidth / 2;
        return center > x && center < x + width;
    };

    let leftFace   = faceBuilder(x        , y         , 1    , height, function (playerWidth)  { return x - playerWidth  - 1; }, isValidX);
    let rightFace  = faceBuilder(x + width, y         , 1    , height, function ()             { return x + width  + 1; }      , isValidX);
    let topFace    = faceBuilder(x        , y         , width, 1     , function (playerHeight) { return y - playerHeight - 1; }, isValidY);
    let bottomFace = faceBuilder(x        , y + height, width, 1     , function ()             { return y + height + 1; }      , isValidY);

    let draw = function (ctx) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    };

    let faces = [];
    faces["topFace"] = topFace;
    faces["bottomFace"] = bottomFace;
    faces["leftFace"] = leftFace;
    faces["rightFace"] = rightFace;

    return {x: x, y: y, width: width, height: height, faces: faces, draw: draw}
}