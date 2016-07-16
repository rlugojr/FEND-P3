var launchScreen = (function(global) {

    "use strict";

    var intro_loop = new Howl({
        src: ['audio/intro_loop.ogg', 'audio/intro_loop.mp3'],
        autoplay: false,
        html5: true,
        loop: true,
        preload: true,
        volume: 0.25
    });

})(this);