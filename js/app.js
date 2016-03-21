var App = (function(global){

    "use strict";
//BASE CLASS DEFINITION
    //define base object "actor", with common methods and properties, used by all character objects for inheritance
    var Actor = function Actor(name,imgSrc, x, y, width, height) {
        this.name = name;
        this.imgSrc = imgSrc;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
    //This creates the initial link in the inheritance chain for the canvas object prototypes
    //Set the constructor for this object
    Actor.prototype.constructor = Actor;
    Actor.prototype.name = "";
    Actor.prototype.imgSrc = "";
    Actor.prototype.x = 0;
    Actor.prototype.y = 0;
    Actor.prototype.width=0;
    Actor.prototype.height=0;
    Actor.prototype.render = function render(ctx,originFeet){
        if(originFeet) {
            ctx.save();
            ctx.translate(0, -1*this.height);
        }
        ctx.drawImage(Resources.get(this.imgSrc), this.x, this.y, this.width, this.height);

        if(originFeet) {ctx.restore()}

    };



//1ST LEVEL OF INHERITANCE

    //define class for inanimate game actors
    var Inanimate = function Inanimate(name,imgSrc, x, y, width, height){
        //Ensure that any reference to "this" references the current object and not the prototype
        // Actor.call(name, x, y, width, height);
        //add properties specific to Inanimate objects;
        Actor.call(this,name,imgSrc, x, y, width, height);
    };
    //Create inheritance chain through prototype to base class Actor prototype
    Inanimate.prototype = Object.create(Actor.prototype);
    //Set the constructor for this object
    Inanimate.prototype.constructor = Inanimate;




    //define class for animated actors
    var Animate = function Animate(name,imgSrc, x, y, width, height) {
        //Ensure that any reference to "this" references the current object and not the prototype
        // Actor.call(name, x, y, width, height);
        //add properties specific to Inanimate objects;
        Actor.call(this,name, imgSrc, x, y, width, height);
    };
    //Create inheritance chain through prototype to base class Actor prototype
    Animate.prototype = Object.create(Actor.prototype);
    //Set the constructor for this object
    Animate.prototype.constructor = Animate;
    //Add any additional properties specific to this object or its children to the prototype.
    Animate.prototype.posHead = 0; //pixels from top of sprite to character's head
    Animate.prototype.posRight = 0; //pixels from left side of sprite to character's rightmost side
    Animate.prototype.posLeft = 0; //pixels from left side of sprite to character's left-tmost side
    Animate.prototype.posFeet = 0; //pixels from top of sprite to character's feet
    Animate.prototype.axis = 'x';
    Animate.prototype.direction = 1;
    Animate.prototype.speed = 256;
    Animate.prototype.moved = false;
    //TODO: method to locate the collision points based on body coordinate and not image boundaries.
   /*
    Animate.prototype.update_posParts = function (){
        this.posHead = this.y; //pixels from top of sprite to character's head
        this.posRight = this.x + this.width; //pixels from left side of sprite to character's rightmost side
        this.posLeft = this.x; //pixels from left side of sprite to character's left-most side
        this.posFeet = this.y + this.height; //pixels from top of sprite to character's feet
    };
    */
    //method to update the object's location based on current position, velocity and collisions.
    Animate.prototype.update = function (dt) {
        var bUp,bDown,bLeft,bRight;

        if(this.moved) {
            //DEBUG: uncomment next 8 lines to debug
           /* console.log("Current X: " + this.x);
            console.log("Current Y: " + this.y);
            console.log("Grid Loc: " + map.getCol(this.x) + ", " +map.getRow(this.y));
            console.log("On Tile: " + map.getTile(1, map.getCol(this.x),map.getRow(this.y)) );
            console.log("Left Tile: " + map.getTile(1, map.getCol(this.x - 64),map.getRow(this.y)));
            console.log("Right Tile: " + map.getTile(1, map.getCol(this.x + 64),map.getRow(this.y)));
            console.log("Top Tile: " + map.getTile(1, map.getCol(this.x),map.getRow(this.y - 64)));
            console.log("Bottom Tile: " + map.getTile(1, map.getCol(this.x),map.getRow(this.y + 64)));*/

            //Check each possible move for blocked tiles listed in map.blockedTiles.
            //Returns a boolean: "true" = blocked, "false" = walkable.
            var tileUp = map.blockedTiles.indexOf(map.getTile(0, map.getCol(this.x), map.getRow(this.y - 64)))>=0;
            var tileDown = map.blockedTiles.indexOf(map.getTile(0, map.getCol(this.x),map.getRow(this.y + 64)))>=0;
            var tileLeft = map.blockedTiles.indexOf(map.getTile(0, map.getCol(this.x - 64),map.getRow(this.y)))>=0;
            var tileRight = map.blockedTiles.indexOf(map.getTile(0, map.getCol(this.x + 64),map.getRow(this.y)))>=0;

            //DEBUG: uncomment to debug
            console.log("Blocks: " + tileUp,tileDown,tileLeft,tileRight);

            //get tile boundaries in pixels
            //
            bUp = (map.getRow(this.y) * 64) + (this.height/2);//Using 1/2 of sprite's height allows the sprite to move to the top unblocked
            bDown = (map.getRow(this.y) * 64) + (this.height/2);//row and also have half their body over the top or under the bottom bounds for 3d-ish effect.
            bLeft = (map.getCol(this.x) * 64);
            bRight= bLeft + 64 - 65;

            //DEBUG: uncomment to debug
            //console.log("bUp: " + bUp);
            //console.log("bDown: " + bDown);
            //console.log("bLeft: " + bLeft);
            //console.log("bRight: " + bRight);

            //create vector to hold the speed and direction of movement.
            var vector = Math.round(this.speed * this.direction * dt);

            //calculate direction and displacement in order to test the updated move
            //before accepting the move and allowing it to be rendered.
            if (this.axis === "x") {
                //create xDisplace to hold potential new x value while it is tested
                var xDisplace = this.x + vector;
                //DEBUG
                console.log("Displacement: " + xDisplace);

                if (this.direction < 0) {
                    if (tileLeft && (bLeft > xDisplace)) {
                        console.log("Can't move left")
                    } else {
                        this.x = xDisplace
                    }
                } else {
                    if (tileRight && (bRight < xDisplace)) {
                        console.log("Can't move Right")
                    } else {
                        this.x = xDisplace
                    }
                }

            }else{
                //create yDisplace to hold potential new y value while it is tested
                var yDisplace = this.y + vector;
                //DEBUG
                console.log("Displacement: " + yDisplace);

                if (this.direction < 0) {
                    if (tileUp && (bUp > yDisplace)) {
                        console.log("Can't move up")
                    } else {
                        this.y = yDisplace
                    }
                } else {
                    if (tileDown && (bDown < yDisplace)) {
                        console.log("Can't move down")
                    } else {
                        this.y = yDisplace
                    }
                }
            }
            //reset moved to false until user presses key to prevent automatic movement.
            this.moved=false;
        }
    };
    //method to check for collision with opponent.
    Animate.prototype.enemyCollisionCheck = function (opponent) {
        if (this.x < opponent.x + opponent.width &&
            this.x +this.width > opponent.x &&
            this.y < opponent.y + opponent.height &&
            this.height + this.y > opponent.y){
            //DEBUG
            console.log('We have a collision on ' + this.x + ", " + this.y);
            opponent = null;
            return true
        } else {
            //DEBUG
            console.log("No collision.");
            return false
        }
    };



//2ND LEVEL OF INHERITANCE

    //define class for enemy - which the player must avoid.  This inherits from Animate.
    var Enemy = function Enemy(name, imgSrc, x, y, width, height, attackPattern, level){
        //Ensure that any reference to "this" references the current object and not the prototype
        Animate.call(this,name,imgSrc, x, y, width, height);
    };
    //Create inheritance chain through prototype to parent class Animate prototype
    Enemy.prototype = Object.create(Animate.prototype);
    //Set the constructor for this object
    Enemy.prototype.constructor = Enemy;
    Enemy.prototype.name = "";
    Enemy.prototype.level = "";
    Enemy.prototype.attackPattern = "";
    //TODO: Override "update" method to use attackPatterns to determine movement.


    //define class for player character.  This inherits from Animate.
    var Player = function Player(name,imgSrc, x, y, width, height){
       //Ensure that any reference to "this" references the current object and not the prototype
       Animate.call(this,name,imgSrc, x, y, width, height);
    };
    //Create inheritance chain through prototype to parent class Animate prototype
    Player.prototype = Object.create(Animate.prototype);
    //Set the constructor for this object
    Player.prototype.constructor = Player;
    //method to handle keyboard input to update player sprite location.
    Player.prototype.handleInput = function(keyCode){
        //code to take key request and update player direction.
        switch(keyCode){
            case 'up':
                this.axis='y';
                this.direction = -1;
                break;
            case 'down':
                this.axis='y';
                this.direction = 1;
                break;
            case 'left':
                this.axis='x';
                this.direction = -1;
                break;
            case 'right':
                this.axis='x';
                this.direction = 1;
                break;
        }
        this.moved = true;
    };



    //artifacts inherits from Inanimate
    var Artifact = function Artifact(name, imgSrc, x, y, width, height, enemyEffected, level){
        //Ensure that any reference to "this" references the current object and not the prototype
        Inanimate.call(this,name,imgSrc, x, y, width, height);
        this.enemyEffected = enemyEffected;
        this.level = level;
    };
    //Create inheritance chain through prototype to parent class Inanimate prototype
    Artifact.prototype = Object.create(Inanimate.prototype);
    //Set the constructor for this object
    Artifact.prototype.constructor = Artifact;
    //Add any additional properties specific to this object or its children to the prototype.
    Artifact.prototype.enemyEffected ="";
    Artifact.prototype.level="";
    //TODO: method to destroy enemy associate with the artifact upon the artifact's capture (collision)
    Artifact.prototype.captured = function captured(){
        console.log("Destroyed Enemy: " + this.enemyEffected)
    };



//3RD LEVEL OF INHERITANCE

    //method that creates an array of objects from a JSON array and an instantiated object - "Pseudo-Factory" pattern
    function objectFactory(arrayElement,protoObj){
        var results = [];

        for (var i=0; i<arrayElement.length;i++) {
            var currItem = arrayElement[i];
            var newObj = Object.create(protoObj.prototype);

            newObj.prototype = protoObj.prototype;
            newObj.prototype.constructor = protoObj;

            newObj.name = currItem.name;
            newObj.imgSrc = currItem.imgSrc;
            newObj.x = currItem.x;
            newObj.y = currItem.y;
            newObj.width = currItem.width;
            newObj.height = currItem.height;
            if(newObj.enemyEffected!==undefined){newObj.enemyEffected = currItem.enemyEffected;}
            if(newObj.attackPattern!==undefined){newObj.attackPattern = currItem.attackPattern;}
            newObj.level = currItem.level;

            results.push(newObj)
        }

        return results
    }

    //create enemy objects
    var enemyList =[
        {"name" : "Carson","imgSrc" : "images/enemies/carson.png","x" : 0,"y" : 0,"width" : 56.7,"height" : 96,"attackPattern" : "sittingDuck","level":1},
        {"name" : "Cruz","imgSrc" : "images/enemies/cruz.png","x" : 0,"y" : 0,"width" : 56.7,"height" : 96,"attackPattern" : "gangUp","level":3},
        {"name" : "Hillary","imgSrc" : "images/enemies/hillary.png","x" : 0,"y" : 0,"width" : 56.7,"height" : 96,"attackPattern" : "barkingMad","level":5},
        {"name" : "Romney","imgSrc" : "images/enemies/romney.png","x" : 0,"y" : 0,"width" : 56.7,"height" : 96,"attackPattern" : "usurper","level":4},
        {"name" : "Rubio","imgSrc" : "images/enemies/rubio.png","x" : 0,"y" : 0,"width" : 56.7,"height" : 96,"attackPattern" : "gangUp","level":3},
        {"name" : "sanders","imgSrc" : "images/enemies/sanders.png","x" : 0,"y" : 0,"width" : 100.5,"height" : 85.93,"attackPattern" : "barely","level":2}
    ];
    //create enemy array
    //create an instance of Enemy to run in the objectFactory
    var enemy = new Enemy();
    enemy.prototype = Enemy.prototype;
    enemy.prototype.constructor = Enemy;

    //use array to hold all artifacts created through the factory method.
    // Place all enemy objects in an array called allEnemies
    var allEnemies = objectFactory(enemyList,enemy);


    // Place the player object in a variable called player
    var player = new Player('The Donald','images/player/trump.png',92,518,65,110);  //set initial y-pos so feet are center tile.
    //Create inheritance chain through prototype to parent class
    player.prototype = Player.prototype;
    //Set the constructor for this object
    player.prototype.constructor = Player;
    //set properties
    player.speed = 1024;
    //player.update_posParts();



    //create artifact objects
    var artifactList =[
        {"name" : "Birth Certificate","imgSrc" : "images/artifacts/birth_certificate.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "cruz","level":3},
        {"name" : "Debate Stand","imgSrc" : "images/artifacts/debate_stand.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "carson","level":1},
        {"name" : "Mail Server","imgSrc" : "images/artifacts/mail_server.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "hillary","level":5},
        {"name" : "Playbill","imgSrc" : "images/artifacts/playbill.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "romney","level":4},
        {"name" : "Bleeding Heart","imgSrc" : "images/artifacts/bleeding_heart.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "sanders","level":2},
        {"name" : "Water Bottle","imgSrc" : "images/artifacts/water_bottle.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "rubio","level":4}
    ];



    //create an instance of Artifact to run in the objectFactory
    var artifact = new Artifact();
    artifact.prototype = Artifact.prototype;
    artifact.prototype.constructor = Artifact;


    //use array to hold all artifacts created through the factory method.
   var artifacts = objectFactory(artifactList,artifact);

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method.
    window.addEventListener('keydown', function(e) {
        var allowedKeys = {
            37: 'left',     //arrow left
            65: 'left',     //'A' key
            38: 'up',       //arrow up
            87: 'up',       //'W' key
            39: 'right',    //arrow right
            68: 'right',    //'D' key
            40: 'down',     //arrow down
            83: 'down',     //'S' key
            32: 'space'     //spacebar
        };

    window.addEventListener('keyup', function(e) {
        delete e.keyCode;
    });
        //event sends keys to player.handleInput
        player.handleInput(allowedKeys[e.keyCode]);
    });

    //expose specific objects to the global scope.
    global.player = player;
    global.artifacts = artifacts;
    global.allEnemies = allEnemies;

})(this);