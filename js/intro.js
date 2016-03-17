var gameScenes = (function(global) {

    "use strict";

    var exitLoop = false;

     var introScenes = [
        ["images/intro/intro_0.png","caption text"],
        ["images/intro/intro_1.png","caption text"],
        ["images/intro/intro_2.png","caption text"],
        ["images/intro/intro_3.png","caption text"],
        ["images/intro/intro_4.png","caption text"],
        ["images/intro/intro_5.png","caption text"],
        ["images/intro/start_screen.png","caption text"]
     ];


     var playIntro = function playIntro(e) {
         var cUI = document.getElementById('cUI');
         var ctxUI = cUI.getContext('2d');
         for(var i=0;i<introScenes.length;i++){
             for(var j=0;j<introScenes[i].length;j++) {

                 do {
                     ctxUI.drawImage(introScenes[i][j],0,0);
                     if (e.keyCode === 32) {
                         exitLoop = true
                     }
                 } while (exitLoop = false);

                 exitLoop = false;
             }
         }
     };

    window.addEventListener('keydown', function(e) {
        var allowedKeys = {
            32: 'space'
        };

        window.addEventListener('keyup', function(e) {
            delete e.keyCode;
        });

        playIntro(allowedKeys[e.keyCode]);
    });


})(this);