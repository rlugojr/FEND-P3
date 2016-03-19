var App = (function(global){

    "use strict";
//BASE CLASS DEFINITION
    //define base object "actor", with common methods and properties, used by all character objects for inheritance
    var Actor = function Actor(sprite, x, y, width, height) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
    //Create initial link in the inheritance chain for base class Actor prototype
    Actor.prototype.render = function render(ctx){
        //Draws the sprite using the canvas context specified by the parameter.
        //Parameter: ctx, a canvas context.
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    //Set the constructor for this object
    Actor.prototype.constructor = Actor;


//1ST LEVEL OF INHERITANCE

    //define class for inanimate game actors
    var Inanimate = function Inanimate(sprite, x, y, width, height){
        //Ensure that any reference to "this" references the current object and not the prototype
        // Actor.call(name, x, y, width, height);
        //add properties specific to Inanimate objects;
        Actor.call(this, sprite, x, y, width, height);
    };
    //Create inheritance chain through prototype to base class Actor prototype
    Inanimate.prototype = Object.create(Actor.prototype);
    //Set the constructor for this object
    Inanimate.prototype.constructor = Inanimate;



    //define class for animated actors
    var Animate = function Animate(sprite, x, y, width, height) {
        //Ensure that any reference to "this" references the current object and not the prototype
        // Actor.call(name, x, y, width, height);
        //add properties specific to Inanimate objects;
        Actor.call(this, sprite, x, y, width, height);
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
    Animate.prototype.update_posParts = function (){
        this.posHead = this.y; //pixels from top of sprite to character's head
        this.posRight = this.x + this.width; //pixels from left side of sprite to character's rightmost side
        this.posLeft = this.x; //pixels from left side of sprite to character's left-most side
        this.posFeet = this.y + this.height; //pixels from top of sprite to character's feet
    };
    //method to update the object's location based on current position, velocity and collisions.
    Animate.prototype.update = function (dt) {
        var bUp,bDown,bLeft,bRight;

        if(this.moved) {
            //DEBUG: uncomment next 8 lines to debug
            console.log("Current X: " + this.x);
            console.log("Current Y: " + this.y);
            console.log("Grid Loc: " + map.getCol(this.x) + ", " +map.getRow(this.y));
            console.log("On Tile: " + map.getTile(1, map.getCol(this.x),map.getRow(this.y)) );
            console.log("Left Tile: " + map.getTile(1, map.getCol(this.x - 64),map.getRow(this.y)));
            console.log("Right Tile: " + map.getTile(1, map.getCol(this.x + 64),map.getRow(this.y)));
            console.log("Top Tile: " + map.getTile(1, map.getCol(this.x),map.getRow(this.y - 64)));
            console.log("Bottom Tile: " + map.getTile(1, map.getCol(this.x),map.getRow(this.y + 64)));

            //Find blocked nearby tiles
            var tileUp = map.blockedTiles.indexOf(map.getTile(1, map.getCol(this.x), map.getRow(this.y - 64)))>=0;
            var tileDown = map.blockedTiles.indexOf(map.getTile(1, map.getCol(this.x),map.getRow(this.y + 64)))>=0;
            var tileLeft = map.blockedTiles.indexOf(map.getTile(1, map.getCol(this.x - 64),map.getRow(this.y)))>=0;
            var tileRight = map.blockedTiles.indexOf(map.getTile(1, map.getCol(this.x + 64),map.getRow(this.y)))>=0;

            //DEBUG: uncomment to debug
            console.log("Blocks: " + tileUp,tileDown,tileLeft,tileRight);

            //get tile boundaries in pixels
            bUp = map.getRow(this.y) * 64;
            bDown = bUp + 64;
            bLeft = map.getCol(this.x) * 64;
            bRight= bLeft + 64;

            //DEBUG: uncomment to debug
            console.log("bUp: " + bUp);
            console.log("bDown: " + bDown);
            console.log("bLeft: " + bLeft);
            console.log("bRight: " + bRight);

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

    //artifacts inherits from Inanimate
    var Artifact = function Artifact(name,sprite, x, y, width, height, enemyEffected, level){
        //Ensure that any reference to "this" references the current object and not the prototype
        Inanimate.call(sprite, x, y, width, height);
        this.name = name;
        this.enemyEffected = enemyEffected;
        this.level = level;
    };
    //Create inheritance chain through prototype to parent class Inanimate prototype
    Artifact.prototype = Object.create(Inanimate.prototype);
    //Set the constructor for this object
    Artifact.prototype.constructor = Artifact;
    //Add any additional properties specific to this object or its children to the prototype.
    Artifact.prototype.name="";
    Artifact.prototype.enemyEffected ="";
    Artifact.prototype.level="";
    //TODO: method to destroy enemy associate with the artifact upon the artifact's capture (collision)
    Artifact.prototype.captured = function captured(){
        console.log("Destroyed Enemy: " + this.enemyEffected)
    };




    //define class for player actors
    var Player = function Player(sprite, x, y, width, height){
       //Ensure that any reference to "this" references the current object and not the prototype
       Animate.call(this,sprite, x, y, width, height);
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
    //method to render the player sprite on the ctxAction canvas.
    //TODO: Move this to parent object so that all can use the same render style.
    Player.prototype.render = function render(ctx){
        //Draws the sprite using the canvas context specified by the parameter.
        //Also, applied a translation so that the origin(x,y) of the image
        //align with the sprite's feet.
        ctx.save();
        ctx.translate(0,-96);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 56.7, 96);
        ctx.restore();
    };


    //define class for monster actors - which the player must avoid.
    var Monster = function Monster(name,sprite, x, y, width, height){
        //Ensure that any reference to "this" references the current object and not the prototype
        Animate.call(this,sprite, x, y, width, height);
        this.name = name;
    };
    //Create inheritance chain through prototype to parent class Animate prototype
    Monster.prototype = Object.create(Animate.prototype);
    //Set the constructor for this object
    Monster.prototype.constructor = Monster;
    //TODO: Override update method to provide different patterns of movement rules depending on monster name.


//3RD LEVEL OF INHERITANCE

    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    //create enemy objects

    //create enemy array


    // Place the player object in a variable called player
    var player = new Player('images/player/trump.png',64,560 + 32);  //set initial y-pos so feet are center tile.
    player.x = 75;
    player.y = 592;
    player.width = 56.7;
    player.height = 96;
    player.speed = 512;
    player.update_posParts();
    //Create inheritance chain through prototype to parent class
    player.prototype = Player.prototype;
    //Set the constructor for this object
    player.prototype.constructor = Player;

    //create artifact objects
    var artifactList =[
        {Artifacts: {"name" : "Birth Certificate","sprite" : "images/artifacts/birth_certificate.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "cruz","level":3}},
        {Artifacts: {"name" : "Debate Stand","sprite" : "images/artifacts/debate_stand.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "carson","level":1}},
        {Artifacts: {"name" : "Mail Server","sprite" : "images/artifacts/mail_server.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "hillary","level":5}},
        {Artifacts: {"name" : "Playbill","sprite" : "images/artifacts/playbill.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "romney","level":4}},
        {Artifacts: {"name" : "Socialist Pin","sprite" : "images/artifacts/socialist_pin.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "sanders","level":2}},
        {Artifacts: {"name" : "Water Bottle","sprite" : "images/artifacts/water_bottle.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "rubio","level":4}}
    ];

    //create an array of objects from a JSON array and the constructor object using a Pseudo-Factory pattern
    function objectFactory(arrayElement,protoObj){
        var results = [];

        for (var i=0; i<arrayElement.length;i++) {
            var currItem = arrayElement[i].Artifacts;
            var newArtifact = new protoObj(currItem.name,currItem.sprite,currItem.x,currItem.y,currItem.width,currItem.height,currItem.enemyEffected);
            newArtifact.prototype = protoObj.prototype;
            newArtifact.prototype.constructor = protoObj;
            results.push(newArtifact)
        }

        return results
    }

    //use array to hold all artifacts created through the factory method.
    var artifacts = objectFactory(artifactList);


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

})(this);