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


     var playIntro = function playIntro() {
         var cUI = Document.getElementById('cUI');
         var ctxUI = cUI.getContext('2d');
         for(var i=0;i<introScenes.length;i++){
             do {
                 ctxUI.drawImage(Resources.get(introScenes[i][0]),0,0);
                 if (dt%5000 ===0) {
                     exitLoop = true
                 }
             } while (exitLoop = false);

             exitLoop = false;
         }
     };

    global.playIntro = playIntro()

})(this);