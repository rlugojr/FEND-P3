/**
 * Created by rlugojr on 3/16/2016.
 */
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
    Actor.call(this, sprite, x, y, width, height);
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
    Inanimate.call(this,sprite, x, y, width, height);
    this.name = name;
    this.enemyEffected = enemyEffected;
};
Artifact.prototype = Object.create(Inanimate.prototype);
Artifact.prototype.constructor = Artifact;
Artifact.prototype.name="";
Artifact.prototype.enemyEffected ="";

Artifact.prototype.captured = function captured(){
    console.log("Destroyed Enemy: " + this.enemyEffected)
};


var artifactList =[
    {Artifacts: {"name" : "Birth Certificate","sprite" : "images/artifacts/birth_certificate.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "cruz"}},
    {Artifacts: {"name" : "Debate Stand","sprite" : "images/artifacts/debate_stand.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "carson"}},
    {Artifacts: {"name" : "Mail Server","sprite" : "images/artifacts/mail_server.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "hillary"}},
    {Artifacts: {"name" : "Playbill","sprite" : "images/artifacts/playbill.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "romney"}},
    {Artifacts: {"name" : "Socialist Pin","sprite" : "images/artifacts/socialist_pin.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "sanders"}},
    {Artifacts: {"name" : "Water Bottle","sprite" : "images/artifacts/water_bottle.png","x" : 0,"y" : 0,"width" : 52,"height" : 30,"enemyEffected" : "rubio"}}
];



var artifacts = [];

function objectFactory(arrayElement){
    var results = [];

    for (var i=0; i<arrayElement.length;i++) {
        var currItem = arrayElement[i].Artifacts;
        var newArtifact = new Artifact(currItem.name,currItem.sprite,currItem.x,currItem.y,currItem.width,currItem.height,currItem.enemyEffected);
        newArtifact.prototype = Artifact.prototype;
        newArtifact.prototype.constructor = Artifact;
        results.push(newArtifact)
    }

        return results
}

artifacts = objectFactory(artifactList);


console.log(artifacts.length);

artifacts.forEach(typeof (e));


function printToScreen(e,index,array) {
    console.log(e.toString());
    console.log(typeof e)
}

















