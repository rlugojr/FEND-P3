var App = (function(global){

    "use strict";

    //define base actor object, with common methods and properties, used for inheritance
    var Actor = function Actor(sprite, x, y, width, height) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

    Actor.prototype.render = function render(ctx){
        //Draws the sprite using the canvas context specified by the parameter.
        //Parameter: ctx, a canvas context.
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    Actor.prototype.constructor = Actor;

    //1st level Inheritance

    //define class for inanimate game actors
    var Inanimate = function Inanimate(sprite, x, y, width, height){
        //Ensure that any reference to "this" references the current object and not the prototype
       // Actor.call(name, x, y, width, height);
        //add properties specific to Inanimate objects;
    };
    //Create inheritance chain through prototype to base class Actor prototype
    Inanimate.prototype = Object.create(Actor.prototype);
    //Set the constructor for this object
    Inanimate.prototype.constructor = Inanimate;



    //define class for animated actors
    var Animate = function Animate(sprite, x, y, width, height) {
        Actor.call(this, sprite, x, y, width, height);
    };

    Animate.prototype = Object.create(Actor.prototype);
    Animate.prototype.constructor = Animate;

    Animate.prototype.posHead = 0; //pixels from top of sprite to character's head
    Animate.prototype.posRight = 0; //pixels from left side of sprite to character's rightmost side
    Animate.prototype.posLeft = 0; //pixels from left side of sprite to character's left-tmost side
    Animate.prototype.posFeet = 0; //pixels from top of sprite to character's feet
    Animate.prototype.axis = 'x';
    Animate.prototype.direction = 1;
    Animate.prototype.speed = 256;
    Animate.prototype.moved = false;

    Animate.prototype.update_posParts = function (){
        this.posHead = this.y; //pixels from top of sprite to character's head
        this.posRight = this.x + this.width; //pixels from left side of sprite to character's rightmost side
        this.posLeft = this.x; //pixels from left side of sprite to character's left-most side
        this.posFeet = this.y + this.height; //pixels from top of sprite to character's feet
    };

    Animate.prototype.update = function (dt) {

        var bUp,bDown,bLeft,bRight;

        if(this.moved) {
            //uncomment next 8 lines to debug
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

            console.log("Blocks: " + tileUp,tileDown,tileLeft,tileRight);

            //get tile boundaries in pixels
            bUp = map.getRow(this.y) * 64;
            bDown = bUp + 64;
            bLeft = map.getCol(this.x) * 64;
            bRight= bLeft + 64;

            console.log("bUp: " + bUp);
            console.log("bDown: " + bDown);
            console.log("bLeft: " + bLeft);
            console.log("bRight: " + bRight);

            //create vector to hold the speed and direction of movement.
            var vector = Math.round(this.speed * this.direction * dt);

            if (this.axis === "x") {
                //create xDisplace to hold potential new x value while it is tested
                var xDisplace = this.x + vector;
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

            this.moved=false;
        }
    };


    Animate.prototype.enemyCollisionCheck = function (opponent) {

        if (this.x < opponent.x + opponent.width &&
            this.x +this.width > opponent.x &&
            this.y < opponent.y + opponent.height &&
            this.height + this.y > opponent.y){
            console.log('We have a collision on ' + this.x + ", " + this.y);
            opponent = null;
            return true
        } else {
            console.log("No collision.");
            return false
        }
    };



    //2nd Level of inheritance

    //artifacts inherit from Inanimate
    var Artifact = function Artifact(name,sprite, x, y, width, height, enemyEffected){
        Inanimate.call(sprite, x, y, width, height);
        this.name = name;
    };
    Artifact.prototype = Object.create(Inanimate.prototype);
    Artifact.prototype.constructor = Artifact;

    Artifact.prototype.captured = function captured(enemy){
        console.log("Destroyed Enemy: " + enemy.name)
    };




    //define class for player actors
    var Player = function Player(sprite, x, y, width, height){
       Animate.call(this,sprite, x, y, width, height);
    };
    Player.prototype = Object.create(Animate.prototype);
    Player.prototype.constructor = Player;
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
    Player.prototype.render = function render(ctx){
        //Draws the sprite using the canvas context specified by the parameter.
        //Parameter: ctx, a canvas context.
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 56.7, 96);
    };


    //define class for monster actors - which the player must avoid.
    var Monster = function Monster(name,sprite, x, y, width, height){
        //Animate.call(this,sprite, x, y, width, height);
        this.name = name;
    };
    Monster.prototype = Object.create(Animate.prototype);
    Monster.prototype.constructor = Monster;




    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player

    //create artifact objects
    var artifacts = [
        ["Birth Certificate",'images/artifacts/birth_certificate.png',map.getRow(),map.getCol(),'cruz'],
        ["Debate Stand",'images/artifacts/debate_stand.png',map.getRow(),map.getCol(),'cruz'],
        ["Mail Server",'images/artifacts/mail_server.png',map.getRow(),map.getCol(),'cruz'],
        ["Playbill",'images/artifacts/playbill.png',map.getRow(),map.getCol(),'cruz'],
        ["Socialist Pin",'images/artifacts/socialist_pin.png',map.getRow(),map.getCol(),'cruz'],
        ["Water Bottle",'images/artifacts/water_bottle.png',map.getRow(),map.getCol(),'cruz']
    ]



    //create artifact array

    //create enemy objects

    //create enemy array

    var player = new Player('images/player/trump.png',64,576 - (96 + 32));  //set initial y-pos so feet are center tile.
        player.x = 75;
        player.y = 448;
        player.width = 56.7;
        player.height = 96;
        player.speed = 512;
        player.update_posParts();


    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    window.addEventListener('keydown', function(e) {
        var allowedKeys = {
            37: 'left',     //arrow left
            65: 'left',     //'A' key
            38: 'up',       //arrow up
            87: 'up',       //'W' key
            39: 'right',    //arrow right
            68: 'right',    //'D' key
            40: 'down',     //arrow down
            83: 'down'      //'S' key
        };

    window.addEventListener('keyup', function(e) {
        delete e.keyCode;
    });

        player.handleInput(allowedKeys[e.keyCode]);
    });

        global.player = player;

})(this);