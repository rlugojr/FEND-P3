var gameIntro = (function(global) {

    "use strict";

    var cUI = doc.getElementById("cUI");
    var ctxUI = cUI.getContext('2d');
    ctxUI.fillStyle = "#FFFFFF";

    var intro = function intro() {
        var currentScene;
        drawScene0 = function () {
            currentScene = 1;
            ctxUI.drawImage(Resources.get('images/intro/intro_0.png'), 0, 0);
        };

        this.drawScene1 = function () {
            currentScene = 2;
            ctxUI.drawImage(Resources.get('images/intro/intro_1.png'), 0, 0);
        };

        this.drawScene2 = function () {
            currentScene = 3;
            ctxUI.drawImage(Resources.get('images/intro/intro_2.png'), 0, 0);
        };

        this.drawScene3 = function () {
            currentScene = 4;
            ctxUI.drawImage(Resources.get('images/intro/intro_3.png'), 0, 0);
        };

        this.drawScene4 = function () {
            currentScene = 5;
            ctxUI.drawImage(Resources.get('images/intro/intro_4.png'), 0, 0);
        };

        this.startScreen = function () {
            currentScene = 6;
            ctxUI.drawImage(Resources.get('images/intro/start_screen.png'), 0, 0);
        };

        this.mouseClicked = function() {
            if (currentScene === 1) {
                drawScene0();
            } else if (currentScene === 2) {
                drawScene1();
            } else if (currentScene === 3) {
                drawScene2();
            } else if (currentScene === 4) {
                drawScene3();
            } else if (currentScene === 5) {
                drawScene4();
            } else if (currentScene === 6) {
                startScreen();
            }
        }
    };

    drawScene0();


})(this);