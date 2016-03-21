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
        cUI = doc.getElementById('cUI'),
        lastTime;

    cGeo.Width = 1280;
    cGeo.Height=1024;
    cAction.Width= 1280;
    cAction.Height= 1024;
    cUI.Width=1280;
    cUI.Height=1024;
    var ctxGeo = cGeo.getContext('2d');
    var ctxAction = cAction.getContext('2d');
    var ctxUI = cUI.getContext('2d');
    /*
    ctxGeo.scale(1,1);
    ctxAction.scale(1,1);
    ctxUI.scale(1,1);
    */

    var intro_loop = new Howl({
        src: ['audio/intro_loop.mp3','audio/intro_loop.ogg'],
        autoplay: false,
        loop: true,
        volume: 0.8
    });



    //TODO: track game states.
    var gameState = function(){
        this.init = false;
        this.loading = false;
        this.startScreen = false;
        this.newGame = false;
        this.paused = false;
        this.won = true;
        this.lost = false;
        this.reset = false;
    };

    function setGameState(setting) {
        for (var i in gameState) {
            if (gameState.hasOwnProperty(i)) {
                if(gameState[i]===setting) {
                    gameState[i] = true
                }else{
                    gameState[i] = false
                }
            }
        }
    }

    //window.addEventListener('resize', resizeCanvas, false);
    //TODO: Handle change in device orientation;
    //window.addEventListener('orientationchange', resizeCanvas, false);


    function drawMap(layer,ctxGeo){
        ctxGeo.clearRect(0, 0, ctxGeo.canvas.width, ctxGeo.canvas.height);
        map._drawLayer(layer,ctxGeo);
    }
    function drawAction(layer,ctxAction){
        ctxAction.clearRect(0, 0, ctxAction.canvas.width, ctxAction.canvas.height);
        map._drawLayer(layer,ctxAction);
    }

/*
    function resizeCanvas(){
        var resX = Math.floor(window.innerWidth);
        var resY = Math.floor(window.innerHeight);

        select case resX {

        }

        cGeo.width = resX;
        cGeo.height = resY;
        cAction.width = resX;
        cAction.height = resY;
        cUI.width = resX;
        cUI.height = resY;

        var scaleX =(cGeo.width/origCanvasWidth);
        var scaleY =(cGeo.height/origCanvasHeight);

        ctxGeo.scale(scaleX,scaleY);
        ctxAction.scale(scaleX,scaleY);
        ctxUI.scale(scaleX,scaleY);

        drawMap(0,ctxGeo);  //draw world map once to conserve memory and cpu cycles
    }
*/



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

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

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

        //setGameState('init');
        //playIntro(e);

        reset();

        lastTime = Date.now();

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
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
       /* allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        */
        player.update(dt,map);

    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {

        drawMap(0,ctxGeo);

        renderEntities();

        drawAction(1,ctxAction);
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        /*allEnemies.forEach(function(enemy) {
            enemy.render();
        });
         */
        player.render(ctxGeo,true);
        //console.log(map.getCol(player.x),map.getRow(player.y))

    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop

        //resizeCanvas();

        drawMap(0,ctxGeo);  //draw world map once to conserve memory and cpu cycles


    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
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
        'images/player/trump.png',
        'images/enemies/carson.png',
        'images/enemies/cruz.png',
        'images/enemies/hillary.png',
        'images/enemies/romney.png',
        'images/enemies/rubio.png',
        'images/enemies/sanders.png'

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    window.ctxGeo = ctxGeo;
    window.ctxAction = ctxAction;
    window.ctxUI = ctxUI;
})(this);
