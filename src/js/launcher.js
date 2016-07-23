var launchScreen = (function(global) {

    "use strict";

    var intro_loop = new Howl({
        src: ['audio/intro_loop.ogg', 'audio/intro_loop.mp3'],
        autoplay: true,
        html5: true,
        loop: true,
        preload: true,
        volume: 0.25
    });

//Help the loader by preloading while the user reads the help or looks at the start screen

assetList = ['images/_textures/spritesheet.png',
            'images/outro/win_screen.jpg',
            'images/outro/lose_screen.jpg',
            'images/effects/explosion.png',
            'images/effects/bang.png',
            'images/effects/level_up.png',
            'images/effects/pow.png',
            'images/effects/yeah.png'
            ];



})(this);