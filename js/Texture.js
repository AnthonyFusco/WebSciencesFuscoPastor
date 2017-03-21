/**
 * Created by Anthony Fusco on 21/03/2017.
 */
function TextureSet(name) {
    let textureImage = new Image();
    textureImage.src = `./sprites/${name}`;
    let request = new Promise(function (resolve, reject) {
        textureImage.onload = function () {
            resolve();
        };
    });

    let getRequest = function(){
        return request;
    };

    return {textureImage:textureImage, name:name, getRequest: getRequest}
}