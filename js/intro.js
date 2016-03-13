var gameIntro = (function(global) {

    "use strict";

     var IntroScenes = function IntroScenes() {

         var cUI = document.getElementById("cUI");
         var ctxUI = cUI.getContext('2d');
         var currentScene = 0;
         var caption = "";

         ctxUI.backgroundColor = "#FFFFFF";


         var drawScene0 = function () {
             currentScene = 1;
             ctxUI.drawImage(Resources.get('images/intro/intro_0.png'), 0, 0);
             caption = ""
         };

         var drawScene1 = function () {
             currentScene = 2;
             ctxUI.drawImage(Resources.get('images/intro/intro_1.png'), 0, 0);
             caption = ""
         };

         var drawScene2 = function () {
             currentScene = 3;
             ctxUI.drawImage(Resources.get('images/intro/intro_2.png'), 0, 0);
             caption = ""
         };

         var drawScene3 = function () {
             currentScene = 4;
             ctxUI.drawImage(Resources.get('images/intro/intro_3.png'), 0, 0);
             caption = ""
         };

         var drawScene4 = function () {
             currentScene = 5;
             ctxUI.drawImage(Resources.get('images/intro/intro_4.png'), 0, 0);
             caption = ""
         };

         var startScreen = function () {
             currentScene = 6;
             ctxUI.drawImage(Resources.get('images/intro/start_screen.png'), 0, 0);
             caption = ""
         };


         function transition() {
             if (currentScene === 0) {
                 drawScene0();
             } else if (currentScene === 1) {
                 drawScene1();
             } else if (currentScene === 2) {
                 drawScene2();
             } else if (currentScene === 3) {
                 drawScene3();
             } else if (currentScene === 4) {
                 drawScene4();
             } else if (currentScene === 5) {
                 startScreen()
             }
         }
     }
})(this);