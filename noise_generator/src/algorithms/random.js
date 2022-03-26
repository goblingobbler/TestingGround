
function random_noise(settings){
    var pixels = [];
    var size = settings['size'];

    for (var i=0;i<size;i++){
        pixels.push([]);

        for (var j=0;j<size;j++){
            var value = Math.floor(Math.random() * 256);
            pixels[i].push(value);
        }
    }

    return pixels;
}

export default random_noise;
