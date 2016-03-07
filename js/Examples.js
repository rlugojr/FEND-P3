(function(){

    //define base actor class used for inheritance
    var Actor = function Actor(name, x, y) {
        this.name = name;
        //this.img = new Image(
        this.x = x;
        this.y = y;
        this.render = function render(layer){};

    };


    //define class for inanimate game actors
   var Inanimate = function Inanimate(name,x,y){};
    //Create inheritance chain through prototype to base class Actor
    Inanimate.prototype = Object.Create(Actor);



    //define class for animated actors
    var Animate = function Animate(name,x,y){
        this.speed = 0;
        this.update = function (xOry,direction) {
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
        this.collisionCheck = function (opponent) {
            if (this.x === opponent.x) {
                if (this.y === opponent.y) {
                    console.log('We have a collision on ' + this.x + ", " + this.y);
                    opponent = null;
                    return true
                }
            } else {
                console.log("No collision.");
                return false
            }
        }
    };
    Animate.prototype = Object.create(Actor);



    //define class for player actors
    var Player = function Player(name,x,y){};
    Player.prototype = new Animate();

    //define class for monster actors
    var Monster = function Monster(name,x,y){};
    Monster.prototype = Animate();








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
        } while (player.collisionCheck(monster) !== true);
        console.log("There were " + count + " rounds until collision.")
    };

    var init = function init() {
        var player = new Player('Player', 10, 10);
        player.speed = 5;

        console.log("Hello, my name is " + player.name);
        console.log("I am standing on coordinates : " + player.x + ", " + player.y);


        var monster = new Monster('monster', 15, 15);
        monster.speed = 4;


        console.log("Hello, my name is " + monster.name);
        console.log("I am standing on coordinates : " + monster.x + ", " + monster.y);
        main(player, monster);
    };

    init();

})();