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

Animate.prototype.axis = 'x';
Animate.prototype.direction = 1;
Animate.prototype.speed = 256;
Animate.prototype.moved = false;

Animate.prototype.update = function (dt) {
    //Parameter: xOry, defines the axis for this movement.
    //Parameter: direction, modifies the direction of movement through multiplication with positive or negative number.
    //              if direction is North or East then return = 1, else = -1
    //Parameter: dt, a time delta between ticks multiplying any movement by the dt parameter ensures the game runs
    //              at the same speed for all computers.
    if(this.moved) {
        var vector = this.speed * this.direction * dt;
        if (this.axis === "x") {
            if (this.x + vector <= 0) {
                this.x = 0;
                console.log(this.name + " stopped at left edge: " + this.x)
            } else if (this.x + vector >= map.maxX) {
                this.x = map.maxX;
                console.log(this.name + " stopped at rightmost edge: " + this.x)
            } else {
                this.x = this.x + vector;
            }
        } else {
            if (this.y + vector <= 0) {
                this.y = 0;
                console.log(this.name + " stopped at topmost edge: " + this.y)
            } else if (this.y + vector >= map.maxY) {
                this.y = map.maxY;
                console.log(this.name + " stopped at bottommost edge: " + this.y)
            } else {
                this.y = this.y + vector;
            }
        }
        this.moved=false;
    }
};
Animate.prototype.collisionCheck = function (opponent) {
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
var Artifact = function Artifact(sprite, x, y, width, height){
    //Inanimate.call(name, x, y, width, height);

};
Artifact.prototype = Object.create(Inanimate.prototype);
Artifact.prototype.constructor = Artifact;




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


//define class for monster actors - which the player must avoid.
var Monster = function Monster(sprite, x, y, width, height){
    //Animate.call(this,name, x, y, width, height);
};
Monster.prototype = Object.create(Animate.prototype);
Monster.prototype.constructor = Monster;




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player('images/player/trump.png',250,250,171,101);
    player.speed = 1000;



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