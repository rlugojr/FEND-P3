

(function(){
    "use strict";

    //define base actor class used for inheritance
    var Actor = function Actor(name, x, y, width, height) {
        this.name = name;
        //this.img = new Image(
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    };

    Actor.prototype.render = function render(ctx){
        //Enter code to render on canvas with context referenced in ctx
    };

    //1st level Inheritance

    //define class for inanimate game actors
    var Inanimate = function Inanimate(name, x, y, width, height){
        //Ensure that any reference to "this" references the current object and not the prototype
        Actor.call(name, x, y, width, height);
        //add properties specific to Inanimate objects;
    };
    //Create inheritance chain through prototype to base class Actor prototype
    Inanimate.prototype = Object.create(Actor.prototype);
    //Set the constructor for this object
    Inanimate.prototype.constructor = Inanimate;



    //define class for animated actors
    var Animate = function Animate(name, x, y, width, height) {
        Actor.call(this, name, x, y, width, height);

        this.speed = 0;
    };

    Animate.prototype = Object.create(Actor.prototype);
    Animate.prototype.constructor = Animate;

    Animate.prototype.update = function (xOry,direction) {
        //if direction is North or East then = 1, else = -1
        var vector = this.speed*direction;
        if(xOry==="x") {
            if ((this.x + vector >=0) && (this.x + vector <= 100)) {
                this.x = this.x + vector;
            }else if ((this.x - vector >=0) && (this.x - vector <= 100)){
                this.x = this.x -vector;
                console.log(this.name + " reversed move on the x axis to position: " + this.x )
            }
        }else{
            if ((this.y + vector >=0) && (this.y + vector <= 100)){
                this.y = this.y + vector;
            } else if((this.y + -vector >=0) && (this.y + -vector <= 100)){
                this.y = this.y - vector;
                console.log(this.name + " reversed move on the Y axis to position: " + -vector)
            }
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
    var Artifact = function Artifact(name, x, y, width, height){
        Inanimate.call(name, x, y, width, height);

    };
    Artifact.prototype = Object.create(Inanimate.prototype);
    Artifact.prototype.constructor = Artifact;




    //define class for player actors
    var Player = function Player(name, x, y, width, height){
        Animate.call(this,name, x, y, width, height);
    };
    Player.prototype = Object.create(Animate.prototype);
    Player.prototype.constructor = Player;

    //define class for monster actors
    var Monster = function Monster(name, x, y, width, height){
        Animate.call(this,name, x, y, width, height);
    };
    Monster.prototype = Object.create(Animate.prototype);
    Monster.prototype.constructor = Monster;



    var main = function Main(player, monster) {
        var plane;
        var direction;
        var count=0;

        do {
            count++;
            plane = (Math.floor(Math.random() * 2) == 0) ? "x" : "y";
            direction = (Math.floor(Math.random() * 2) == 0) ? -1 : 1;

            player.update(plane,direction);
            console.log(player.name + " is now standing on coordinates : " + player.x + ", " + player.y);

            plane = (Math.floor(Math.random() * 2) == 0) ? "x" : "y";
            direction = (Math.floor(Math.random() * 2) == 0) ? -1 : 1;

            monster.update(plane,direction);
            console.log(monster.name + " is now standing on coordinates : " + monster.x + ", " + monster.y);
        } while ( (monster.collisionCheck(player)) !== true);
        console.log("There were " + count + " rounds until collision.")
    };

    var init = function init() {
        var player = new Player('Player', 10, 10,32,32);
        player.speed = 5;

        console.log("Hello, my name is " + player.name);
        console.log("I am standing on coordinates : " + player.x + ", " + player.y);


        var monster = new Monster('monster', 25,50,32,32);
        monster.speed = 4;


        console.log("Hello, my name is " + monster.name);
        console.log("I am standing on coordinates : " + monster.x + ", " + monster.y);
        main(player, monster);
    };

    init();

})();