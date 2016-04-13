/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {

    "use strict";

    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        cGeo = doc.getElementById('cGeo'),
        cAction = doc.getElementById('cAction'),
        cScenery= doc.getElementById('cScenery'),
        cUI = doc.getElementById('cUI'),
        lastTime,
        currEnemy=[],
        currArtifact=[],
        currExplosion =[];

    var ctxGeo = cGeo.getContext('2d');
    var ctxAction = cAction.getContext('2d');
    var ctxScenery = cScenery.getContext('2d');
    var ctxUI = cUI.getContext('2d');


    var intro_loop = new Howl({
        src: ['audio/intro_loop.mp3', 'audio/intro_loop.ogg'],
        autoplay: false,
        loop: true,
        volume: 0.5
    });


    var gameState = function gameState() {
        this.level = {
            1:"Level 1 : A Lame Duck",
            2:"Level 2 : Barely Sane-ders",
            3:"Level 3 : Gang Him Style",
            4:"Level 4 : Usurp the Throne",
            5:"level 5 : Barking Mad"
        };
        this.currentState ="running";
        /* values can be:
            loading: 'loading',
            init: 'initializing',
            menu: 'menu',
            running: 'running',
            paused: 'paused'
        */
        this.playerState = "inLevel";
        /*values can be:
            pause:'pause',
            reset:'reset',
            inLevel:'inLevel'
            beatLevel:'beatLevel',
            lostLevel:'lostLevel',
            wonGame:'wonGame',
            lostGame:'lostGame',
            gameOver:'gameOver'
        */
    };


    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationChange', resizeCanvas, false);


    function drawMap(layer, ctxGeo) {
        ctxGeo.clearRect(0, 0, ctxGeo.canvas.width, ctxGeo.canvas.height);
        map._drawLayer(layer, ctxGeo);
    }

    function drawAction(layer, ctxAction) {
        ctxAction.clearRect(0, 0, ctxAction.canvas.width, ctxAction.canvas.height);
        //map._drawLayer(layer, ctxAction);
    }

    function drawScenery(layer, ctxScenery) {
        ctxScenery.clearRect(0, 0, ctxScenery.canvas.width, ctxScenery.canvas.height);
        map._drawLayer(layer, ctxScenery);
    }

    function drawUI(layer, ctxUI){
        ctxUI.clearRect(0,0, ctxUI.canvas.width, ctxUI.canvas.height)
    }


    function resizeCanvas() {
        var worldView = document.getElementById('worldView');

        var aspectRatio = 4 / 3;

        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;

        var newAspectRatio = newWidth / newHeight;

        if (newAspectRatio > aspectRatio) {
            newWidth = newHeight * aspectRatio;
            worldView.style.height = newHeight + 'px';
            worldView.style.width = newWidth + 'px';
        } else {
            newHeight = newWidth / aspectRatio;
            worldView.style.width = newWidth + 'px';
            worldView.style.height = newHeight + 'px';
        }

        worldView.style.marginTop = (-newHeight / 2) + 'px';
        worldView.style.marginLeft = (-newWidth / 2) + 'px';

        var cGeoResize = doc.getElementById('cGeo');
        var cActionResize = doc.getElementById('cAction');
        var cSceneryResize = doc.getElementById('cScenery');
        var cUIResize = doc.getElementById('cUI');

        cGeoResize.width = newWidth;
        cGeoResize.height = newHeight;
        cActionResize.width = newWidth;
        cActionResize.height = newHeight;
        cSceneryResize.width = newWidth;
        cSceneryResize.height = newHeight;
        cUIResize.width = newWidth;
        cUIResize.height = newHeight;

        var scaleRatio = (newWidth / 400) * .30;

        var ctxGeoResize = cGeoResize.getContext("2d");
        var ctxActionResize = cActionResize.getContext("2d");
        var ctxSceneryResize = cSceneryResize.getContext('2d');
        var ctxUIResize = cUIResize.getContext("2d");

        ctxGeoResize.scale(scaleRatio, scaleRatio);
        ctxActionResize.scale(scaleRatio, scaleRatio);
        ctxSceneryResize.scale(scaleRatio, scaleRatio);
        ctxUIResize.scale(scaleRatio, scaleRatio);


    }

        function playIntro(ctxUI, dt) {
            var introScenes = [
                ["images/intro/intro_0.png","caption text"],
                ["images/intro/intro_1.png","caption text"],
                ["images/intro/intro_2.png","caption text"],
                ["images/intro/intro_3.png","caption text"],
                ["images/intro/intro_4.png","caption text"],
                ["images/intro/intro_5.png","caption text"],
                ["images/intro/start_screen.png","caption text"]];

            var currImage = new Image();

            for(var i=0;i < introScenes.length-1 ;i++) {

                currImage= Resources.get(introScenes[i][0]);
                ctxUI.drawImage(currImage, 0, 0);

                var wait=0;
                do {
                    wait = wait++
                } while (wait < (dt*5))
            }
        }



    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        if(gameState.currentState !=='paused') {
            gameState.currentState = 'running';

            update(dt);

            if (gameState.playerState === 'beatLevel') {
                if (gameState.level >= 5) {
                    gameState.playerState = 'wonGame';
                    if (currExplosion.length === 0) {
                        game_loop.stop;
                        game_loop.unload();
                        console.log("Explosion finished and you won the game")
                    }
                    //exit code for WIN
                } else {
                    gameState.level++;
                    levelSetup(gameState.level);
                    gameState.playerState = 'inLevel'
                }
            }

            if (gameState.playerState === 'gotHit') {
                levelSetup(gameState.level);
                gameState.playerState = 'inLevel'
            }

            render();
        }
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {

        gameState.currentState = 'initializing';

        //playIntro(ctxUI);

        reset();

        lastTime = Date.now();

        levelSetup();

        var game_loop = new Howl({
            src: ['audio/gameplay_loop.mp3','audio/gameplay_loop.ogg'],
            autoplay: true,
            loop: true,
            volume: 0.5,
            onload: function() {
                console.log('Finished loading game_loop!');
            }
        });

        main();
    }

    function levelSetup(){
        /* This function retrieves the enemy and artifact objects
           and places prepares them to be updated and rendered.
           Player is transported to starting position.
         */

        currEnemy = level[gameState.level][0];
        currArtifact = level[gameState.level][1];
        player.startPosition()

    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        //update position of all objects to be rendered.
        updateEntities(dt);
        //check for collisions between player and artifacts or enemies.
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {

        //update player position according to the user input and game rules.
        player.update(dt,map);
        egometer.update(player.ego,"Ego");

        //update each enemy position for each enemy in the level.
        for (var e=0;e<=currEnemy.length-1;e++) {
                currEnemy[e].update(dt)
        }

        //Update the animation for any explosions that have been queued.
        for (var d=0;d<=currExplosion.length-1;d++) {
            if(currExplosion[d].active = true) {
                currExplosion[d].update(dt, map)
            }
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render(dt) {
        /* drawMap has been commented out while I test if there is a need to update it
            during gameplay.  So far, there hasn't been a need to repaint the Geo layer with the
            map tiles so we will keep this commented out until we find a need to enable it again.

            if ((dt%10000)==0) {
                drawMap(0, ctxGeo);
            }

        */
        //clear Action layer and draw any "special" items that are positioned using Action grid.)
        drawAction(1,ctxAction);

        //draw any objects that provide health status or notifications to the user.
        drawUI(1,ctxUI);

        //draw all objects rendered in the Action layer (player, enemies, artifacts, explosions)
        renderEntities();

        //drawScenery has been commented out for the same reason as drawMap.
        //drawScenery(2,ctxScenery);




    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */

        for (var a=0;a<=currArtifact.length-1;a++) {
            currArtifact[a].render(ctxAction)
        }

        for (var e=0;e<=currEnemy.length-1;e++) {
            currEnemy[e].render(ctxAction)
        }

        for (var x=0;x<=currExplosion.length-1;x++) {
            if(currExplosion[x].active === true) {
                currExplosion[x].render(ctxAction)
            }
        }

        player.render(ctxAction);
        egometer.render(ctxUI)

    }

    function checkCollisions(){
        var gotArtifact;
        var gotHit;

        for (var f=0;f<=currArtifact.length-1;f++) {
            gotArtifact = player.collisionCheck(currArtifact[f]);
            //console.log("gotArtifact :" + gotArtifact);
            if (gotArtifact) {
                //debug
                var target = currArtifact[f].enemyEffected;

                for (var t = 0; t <= currEnemy.length - 1; t++) {
                    var suspect = currEnemy[t].id;
                    if (suspect == target) {
                        var tarX, tarY;
                        tarX = currEnemy[t].x;
                        tarY = currEnemy[t].y - currEnemy[t].height;

                        var explode = new newExplosion(tarX,tarY);
                        explode.prototype = newExplosion.prototype;
                        explode.prototype.constructor = newExplosion;
                        explode.reset();

                        explode.playTagLine('audio/fired.mp3','audio/fired.ogg');
                        currExplosion.push(explode);
                        currArtifact.splice(f, 1);
                        currEnemy.splice(t, 1);

                        if (currEnemy.length === 0){
                            gameState.playerState = 'beatLevel';
                            player.ego += 10;
                            break
                        }
                    }
                }
            }
        }

        for (var e=0;e<=currEnemy.length-1;e++) {
            gotHit = player.collisionCheck(currEnemy[e]);
            console.log("gotHit :" + gotHit);
            if(gotHit){
                player.ego -= 10;
                gameState.playerState = 'gotHit'
            }
        }
    }


    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        //set starting game level
        gameState.level=1;

        //resize canvas to fit the current browser window optimally.
        resizeCanvas();

        //draw map and scenery layers because they don't change and won't need to be rendered again.
        drawMap(0,ctxGeo);  //draw world map once to conserve memory and cpu cycles
        drawScenery(2,ctxScenery);  //draw scenery objects once to conserve memory and cpu cycles


    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/keys/a.png',
        'images/keys/d.png',
        'images/keys/s.png',
        'images/keys/w.png',
        'images/keys/up.png',
        'images/keys/down.png',
        'images/keys/left.png',
        'images/keys/right.png',
        'images/keys/space.png',
        'images/intro/intro_0.png',
        'images/intro/intro_1.png',
        'images/intro/intro_2.png',
        'images/intro/intro_3.png',
        'images/intro/intro_4.png',
        'images/intro/start_screen.png',
        'images/outro/win_screen.png',
        'images/outro/lose_screen.png',
        'images/tiles/grass.png',
        'images/tiles/pavers.png',
        'images/tiles/rock.png',
        'images/tiles/tree.png',
        'images/tiles/pink_tree.png',
        'images/tiles/green_tree.png',
        'images/tiles/wall_vertical.png', //20
        'images/tiles/wall_horizontal.png', //21
        'images/tiles/wall_corner.png', //22
        'images/artifacts/birth_certificate.png',
        'images/artifacts/debate_stand.png',
        'images/artifacts/mail_server.png',
        'images/artifacts/playbill.png',
        'images/artifacts/bleeding_heart.png',
        'images/artifacts/water_bottle.png',
        'images/player/trump_suit.png',
        'images/enemies/carson.png',
        'images/enemies/cruz.png',
        'images/enemies/hillary.png',
        'images/enemies/romney.png',
        'images/enemies/rubio.png',
        'images/enemies/sanders.png',
        'images/effects/explosion.png'


    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    window.ctxGeo = ctxGeo;
    window.ctxAction = ctxAction;
    window.ctxScenery = ctxScenery;
    window.ctxUI = ctxUI;

    //add gameState to global for access from any other js file.
    global.gameState = gameState;

})(this);
