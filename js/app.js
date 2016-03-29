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
        this.offsetTop = 0;
        this.offsetBottom = 0;
        this.offsetLeft = 0;
        this.offsetRight = 0;
        this.boxTop = 0;
        this.boxBottom = 0;
        this.boxLeft = 0;
        this.boxRight = 0;
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
    Actor.prototype.offsetTop = 0; //pixels from top of sprite to character's head
    Actor.prototype.offsetBottom = 0; //pixels from top of sprite to character's feet
    Actor.prototype.offsetLeft = 0; //pixels from left side of sprite to character's left-most side
    Actor.prototype.offsetRight = 0; //pixels from left side of sprite to character's right-most side
    Actor.prototype.boxTop = 0;
    Actor.prototype.boxBottom = 0;
    Actor.prototype.boxLeft = 0;
    Actor.prototype.boxRight = 0;

    Actor.prototype.calcSides = function(){
        this.boxTop = this.y - (this.height + this.offsetTop);
        this.boxBottom = this.y - this.offsetBottom;
        this.boxLeft = this.x  + this.width - this.offsetLeft;
        this.boxRight = this.x  + this.offsetLeft
    };
    Actor.prototype.render = function render(ctx){
        //draw actor with negative height so that the origin starts at the bottom left of sprite.
        ctx.save();
        ctx.translate(0, -1*this.height);
        ctx.drawImage(Resources.get(this.imgSrc), this.x, this.y, this.width, this.height);
        ctx.restore();
        //DEBUG
        //draw bound box hit area
        /*
        ctx.save();
        ctx.lineWidth = "1";
        ctx.strokeStyle="red";
        ctx.strokeRect(this.x + this.offsetRight,this.y - this.offsetBottom,this.width - this.offsetRight - this.offsetLeft,-1*(this.height-this.offsetTop-this.offsetBottom));
        ctx.restore()
        */
    };
    Actor.prototype.renderText=function renderText(ctx){
        //display name above sprite
        ctx.save();
        ctx.font = "8px";
        ctx.textAlign='center';
        ctx.strokeText(this.name,this.x,-1*this.height-5);
        ctx.restore();
    };
    //method to check for collision with opponent.
    Actor.prototype.collisionCheck = function (obj) {
        //DEBUG

        //Define point to check inside of target bound box.
        return !(
            ( ( this.y + this.height ) < ( obj.y ) ) ||
            ( this.y > ( obj.y + obj.height ) ) ||
            ( ( this.x + obj.width ) < obj.x ) ||
            ( this.x > ( obj.x + obj.width ) )
        )
    };




//1ST LEVEL OF INHERITANCE

    //define class for inanimate game actors
    var Inanimate = function Inanimate(name,imgSrc, x, y, width, height){
        //Ensure that any reference to "this" references the current object and not the prototype
        // Actor.call(name, x, y, width, height);
        //add properties specific to Inanimate objects;
        Actor.call(this,name,imgSrc,x,y,width, height);
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
    Animate.prototype.axis = 'x';
    Animate.prototype.direction = 1;
    Animate.prototype.speed = 256;
    Animate.prototype.moved = false;

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
            //console.log("Blocks: " + tileUp,tileDown,tileLeft,tileRight);

            //get tile boundaries in pixels
            //
            bUp = 64 + (this.height/2);//Using 1/2 of sprite's height allows the sprite to move to the top unblocked
            bDown = 1024 - (this.height/2);//row and also have half their body over the top or under the bottom bounds for 3d-ish effect.
            bLeft = 64;
            bRight= map.maxX - 64 - (this.width);

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
                //console.log("Displacement: " + xDisplace);

                if (this.direction < 0) {
                    if (tileLeft && (bLeft > xDisplace)) {
                        //DEBUG
                        //console.log("Can't move left")
                    } else {
                        this.x = xDisplace
                    }
                } else {
                    if (tileRight && (bRight < xDisplace)) {
                        //DEBUG
                        //console.log("Can't move Right")
                    } else {
                        this.x = xDisplace
                    }
                }

            }else{
                //create yDisplace to hold potential new y value while it is tested
                var yDisplace = this.y + vector;
                //DEBUG
                //console.log("Displacement: " + yDisplace);

                if (this.direction < 0) {
                    if (tileUp && (bUp > yDisplace)) {
                        //DEBUG
                        //console.log("Can't move up")
                    } else {
                        this.y = yDisplace
                    }
                } else {
                    if (tileDown && (bDown < yDisplace)) {
                        //DEBUG
                        //console.log("Can't move down")
                    } else {
                        this.y = yDisplace
                    }
                }
            }
            //reset moved to false until user presses key to prevent automatic movement.
            this.moved=false;
        }
    };



//2ND LEVEL OF INHERITANCE

    //define class for enemy - which the player must avoid.  This inherits from Animate.
    var Enemy = function Enemy(name, imgSrc, x, y, width, height,offsetTop, offsetBottom, offsetLeft, offsetRight, attackPattern, level){
        //Ensure that any reference to "this" references the current object and not the prototype
        Animate.call(this,name,imgSrc,x,y,width,height,offsetTop,offsetBottom,offsetLeft,offsetRight);
    };
    //Create inheritance chain through prototype to parent class Animate prototype
    Enemy.prototype = Object.create(Animate.prototype);
    //Set the constructor for this object
    Enemy.prototype.constructor = Enemy;
    Enemy.prototype.name = "";
    Enemy.prototype.attackPattern='';
    Enemy.prototype.level = "";
    Enemy.prototype.update = function(dt){
        switch(this.attackPattern) {
            case "sittingDuck":
                //do nothing, just sit there.
                break;
            case "barelySane-ders":
                var pick;
                var picked = {};
                var moves = [{axis:"x",direction:-1},{axis:"x",direction:1},{axis:"y",direction:-1},{axis:"y",direction:1},
                            {axis:"x",direction:1},{axis:"y",direction:1},{axis:"y",direction:-1},{axis:"x",direction:-1},
                            {axis:"x",direction:-1},{axis:"y",direction:-1},{axis:"y",direction:-1},{axis:"x",direction:-1},
                            {axis:"x",direction:1},{axis:"y",direction:1},{axis:"y",direction:1},{axis:"x",direction:1},
                            {axis:"x",direction:-1},{axis:"x",direction:1},{axis:"y",direction:-1},{axis:"y",direction:1},
                            {axis:"x",direction:1},{axis:"y",direction:1},{axis:"y",direction:-1},{axis:"x",direction:-1},
                            {axis:"x",direction:-1},{axis:"y",direction:-1},{axis:"y",direction:-1},{axis:"x",direction:-1},
                            {axis:"x",direction:1},{axis:"y",direction:1},{axis:"y",direction:1},{axis:"x",direction:1},
                            {axis:"x",direction:-1},{axis:"x",direction:1},{axis:"y",direction:-1},{axis:"y",direction:1},
                            {axis:"x",direction:1},{axis:"y",direction:1},{axis:"y",direction:-1},{axis:"x",direction:-1},
                            {axis:"x",direction:-1},{axis:"y",direction:-1},{axis:"y",direction:-1},{axis:"x",direction:-1},
                            {axis:"x",direction:1},{axis:"y",direction:1},{axis:"y",direction:1},{axis:"x",direction:1},
                            {axis:"x",direction:-1},{axis:"x",direction:1},{axis:"y",direction:-1},{axis:"y",direction:1},
                            {axis:"x",direction:1},{axis:"y",direction:1},{axis:"y",direction:-1},{axis:"x",direction:-1},
                            {axis:"x",direction:-1},{axis:"y",direction:-1},{axis:"y",direction:-1},{axis:"x",direction:-1},
                            {axis:"x",direction:1},{axis:"y",direction:1},{axis:"y",direction:1},{axis:"x",direction:1}];
                var axis;
                var direction;
                var vector;
                var minX=448;
                var minY=320;
                var maxX=768;
                var maxY=640;
                var inBounds;

                this.speed = 20;

                pick = Math.round(Math.random() * (moves.length));
                //debug
                //console.log(pick);

                if(pick !== 0){pick = pick - 1}
                picked = moves[pick];
                axis = picked.axis;
                direction = picked.direction;
                vector = Math.round(this.speed * direction);

                inBounds = false;
                do{
                    if (axis === "x") {
                        if(this.x + vector <= minX){
                            this.x = minX
                        }else if(this.x + vector >= maxX){
                            this.x = maxX
                        }else {
                            this.x = this.x + vector;
                        }
                    } else if(axis==="y"){
                        if(this.y + vector <= minY){
                            this.y = minY
                        }else if(this.y + vector >= maxY){
                            this.y = maxY
                        }else {
                            this.y = this.y + vector;
                        }
                    }
                }while(inBounds = false);
                break;
            case "guardDog":{
                var minY = 64,
                    midY = 512,
                    maxY = map.maxY -64

                //mirror player up and down but stay in back to guard the items
                //while lil Rubio headhunts.

                this.y = player.y


            }
        }

    };

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
    var Artifact = function Artifact(name, imgSrc, x, y, width, height,offsetTop, offsetBottom, offsetLeft, offsetRight, enemyEffected, level){
        //Ensure that any reference to "this" references the current object and not the prototype
        Inanimate.call(this,name,imgSrc, x, y, width, height,offsetTop, offsetBottom,offsetLeft,offsetRight);
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
            newObj.offsetTop = currItem.offsetTop;
            newObj.offsetBottom = currItem.offsetBottom;
            newObj.offsetLeft = currItem.offsetLeft;
            newObj.offsetRight = currItem.offsetRight;
            newObj.speed = currItem.speed;
            newObj.boxTop = currItem.y - currItem.height + currItem.offsetTop;
            newObj.boxBottom = currItem.y - currItem.offsetBottom;
            newObj.boxLeft = currItem.x  + currItem.width - currItem.offsetLeft;
            newObj.boxRight = currItem.x  + currItem.offsetLeft;
            if(newObj.enemyEffected!==undefined){newObj.enemyEffected = currItem.enemyEffected;}
            if(newObj.attackPattern!==undefined){newObj.attackPattern = currItem.attackPattern;}
            newObj.level = currItem.level;

            results.push(newObj)
        }

        return results
    }

    //create enemy objects
    var enemyList =[
        {"name" : "TurDuckarson","imgSrc" : "images/enemies/carson.png","x" : 640,"y" : 512,"width" : 75,"height" : 95,
            "offsetTop":1,"offsetBottom":5,"offsetLeft":15,"offsetRight":6,"speed":0,
            "attackPattern" : "lameDuck","level":1},
        {"name" : "Lyin Ted","imgSrc" : "images/enemies/cruz.png","x" : 1152,"y" : 512,"width" : 65,"height" : 110,
            "offsetTop":1,"offsetBottom":1,"offsetLeft":16,"offsetRight":9,"speed":5,
            "attackPattern" : "guardDog","level":3},
        {"name" : "Hilantula","imgSrc" : "images/enemies/hillary.png","x" : 640,"y" : 384,"width" : 90,"height" : 80,
            "offsetTop":3,"offsetBottom":1,"offsetLeft":7,"offsetRight":7,"speed":5,
            "attackPattern" : "barkingMad","level":5},
        {"name" : "The Usurper","imgSrc" : "images/enemies/romney.png","x" : 640,"y" : 128,"width" : 65,"height" : 110,
            "offsetTop":1,"offsetBottom":1,"offsetLeft":1,"offsetRight":2,"speed":5,
            "attackPattern" : "usurper","level":4},
        {"name" : "Lil Marco","imgSrc" : "images/enemies/rubio.png","x" : 576,"y" : 512,"width" : 65,"height" : 110,
            "offsetTop":14,"offsetBottom":2,"offsetLeft":1,"offsetRight":7,"speed":5,
            "attackPattern" : "headHunter","level":3},
        {"name":"Lenin Marx","imgSrc":"images/enemies/sanders.png","x":640,"y":640,"width":65,"height":110,"offsetTop":1,"offsetBottom":1,"offsetLeft":8,"offsetRight":8,"speed":20,"attackPattern":"barelySane-ders","level":2}
    ];
    //create enemy array
    //create an instance of Enemy to run in the objectFactory
    var enemy = new Enemy();
    enemy.prototype = Enemy.prototype;
    enemy.prototype.constructor = Enemy;

    //use array to hold all artifacts created through the factory method.
    // Place all enemy objects in an array called allEnemies
    var allEnemies = objectFactory(enemyList,enemy);


    //create artifact objects
    var artifactList =[
        {"name" : "Debate Stand","imgSrc" : "images/artifacts/debate_stand.png","x" : 540,"y" : 511,"width" : 50,"height" : 100,
            "offsetTop":5,"offsetBottom":1,"offsetLeft":16,"offsetRight":10,
            "enemyEffected" : "carson","level":1},
        {"name" : "Birth Certificate","imgSrc" : "images/artifacts/birth_certificate.png","x" : 1152,"y" : 120,"width" : 52,"height" : 30,
            "offsetTop":0,"offsetBottom":0,"offsetLeft":0,"offsetRight":0,
            "enemyEffected" : "cruz","level":3},
        {"name" : "Mail Server","imgSrc" : "images/artifacts/mail_server.png","x" : 512,"y" : 512,"width" : 45,"height" : 75,
            "offsetTop":55,"offsetBottom":19,"offsetLeft":2,"offsetRight":1,
            "enemyEffected" : "hillary","level":5},
        {"name" : "Playbill","imgSrc" : "images/artifacts/playbill.png","x" : 512,"y" : 512,"width" : 50,"height" : 85,
            "offsetTop":26,"offsetBottom":5,"offsetLeft":5,"offsetRight":5,
            "enemyEffected" : "romney","level":4},
        {"name" : "Bleeding Heart","imgSrc" : "images/artifacts/bleeding_heart.png","x" : 780,"y" : 352,"width" : 50,"height" : 85,
            "offsetTop":5,"offsetBottom":1,"offsetLeft":5,"offsetRight":5,
            "enemyEffected" : "sanders","level":2},
        {"name" : "Water Bottle","imgSrc" : "images/artifacts/water_bottle.png","x" : 1170,"y" : 950,"width" : 35,"height" : 70,
            "offsetTop":24,"offsetBottom":5,"offsetLeft":8,"offsetRight":8,
            "enemyEffected" : "rubio","level":3}
    ];



    //create an instance of Artifact to run in the objectFactory
    var artifact = new Artifact();
    artifact.prototype = Artifact.prototype;
    artifact.prototype.constructor = Artifact;


    //use array to hold all artifacts created through the factory method.
   var artifacts = objectFactory(artifactList,artifact);

    //create array to hold artifacts and enemies per level
    var lvlEnemies =[],lvlArtifacts=[];
    var level = [];

    //No Level #0 so fill the first element to prevent errors.
    level.push(["lvlEnemies","lvlArtifacts"])

    //Populate the levels.
    for(var lvl=1 ; lvl <= Math.max(allEnemies.length, artifacts.length)-1; lvl++){
        lvlEnemies =[];
        lvlArtifacts=[];

        lvlEnemies = allEnemies.filter(function(item) {
            return item.level === lvl
        });
        lvlArtifacts = artifacts.filter(function(item){
            return item.level === lvl
        });
        level.push([lvlEnemies,lvlArtifacts])
    }

    // Place the player object in a variable called player
    var player = new Player('The Donald','images/player/trump.png',92,518,81,138);  //set initial y-pos so feet are center tile.
    //Create inheritance chain through prototype to parent class
    player.prototype = Player.prototype;
    //Set the constructor for this object
    player.prototype.constructor = Player;
    //set properties
    player.speed = 1024;
    player.offsetTop = 8;
    player.offsetBottom = 1;
    player.offsetLeft=13;
    player.offsetRight=20;
    player.calcSides();


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
    global.level = level;
    global.lvlEnemies = lvlEnemies;
    global.lvlArtifacts = lvlArtifacts;

})(this);