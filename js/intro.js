var gameScenes = (function(global) {

    "use strict";

    var exitLoop = false;

     var introScenes =  {
         "scenes" :[
            {
                "img" : "Resources.get('images/intro/intro_0.png')",
                "caption":""
            },
            {
                 "img" : "Resources.get('images/intro/intro_1.png')",
                 "caption":""
            },
            {
                 "img" : "Resources.get('images/intro/intro_2.png')",
                 "caption":""
            },
            {
                 "img" : "Resources.get('images/intro/intro_3.png')",
                 "caption":""
            },
            {
                 "img" : "Resources.get('images/intro/intro_4.png')",
                 "caption":""
            },
            {
                 "img" : "Resources.get('images/intro/start_screen.png')",
                 "caption":""
            }
         ]

     };

     var currentScene;

     function playIntro(event) {
         for(currentScene in introScenes.scenes){
             console.log(currentScene.img);
             console.log(currentScene.caption);

             do{
                 console.log("waiting for Mr.Spacebar")
             }while (exitLoop = false);

             exitLoop = false;
         }
     }

    playIntro();


    Window.addEventListener('keydown', function(e) {
        var allowedKeys = {
            32: 'spacebar'

        };

        Window.addEventListener('keyup', function(e) {
            delete e.keyCode;
        });

        if(e.keycode === 'Spacebar') {
            console.log(e.keycode);
            exitLoop = true
        }
        });



     global.playIntro = playIntro();


})(this);