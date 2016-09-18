var App = ( function ( global ) {

	"use strict";

	var newX, newY;


	//BASE CLASS DEFINITION
	//define base object "actor", with common methods and properties, used by all character objects for inheritance
	var Actor = function Actor( id, name, imgSrc, sx, sy, sw, sh, x, y, width, height ) {
		this.id = id;
		this.name = name;
		this.imgSrc = imgSrc;
		this.sx = sx;
		this.sy = sy;
		this.sw = sw;
		this.sh = sh;
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
	Actor.prototype.id = "";
	Actor.prototype.name = "";
	Actor.prototype.imgSrc = "";
	Actor.prototype.x = 0;
	Actor.prototype.y = 0;
	Actor.prototype.width = 0;
	Actor.prototype.height = 0;
	Actor.prototype.offsetTop = 0; //pixels from top of sprite to character's head
	Actor.prototype.offsetBottom = 0; //pixels from top of sprite to character's feet
	Actor.prototype.offsetLeft = 0; //pixels from left side of sprite to character's left-most side
	Actor.prototype.offsetRight = 0; //pixels from left side of sprite to character's right-most side
	Actor.prototype.boxTop = 0;
	Actor.prototype.boxBottom = 0;
	Actor.prototype.boxLeft = 0;
	Actor.prototype.boxRight = 0;

	Actor.prototype.calcSides = function () {
		this.boxTop = this.y - ( this.height + this.offsetTop );
		this.boxBottom = this.y - this.offsetBottom;
		this.boxLeft = this.x + this.width - this.offsetLeft;
		this.boxRight = this.x + this.offsetLeft;
	};
	Actor.prototype.render = function render( ctx ) {
		//draw actor with negative height so that the origin starts at the bottom left of sprite.
		ctx.save();
		ctx.translate( 0, -1 * this.height );
		ctx.drawImage( Resources.get( this.imgSrc ), this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height );

		//DEBUG
		//draw bound box hit area
		/*ctx.strokeStyle = 'red';
		ctx.lineWidth = 2;
		ctx.strokeRect(this.x,this.y,this.width,this.height);
		DEBUG*/

		ctx.restore();

	};

	//method to check for collision with opponent.
	Actor.prototype.collisionCheck = function ( obj ) {
		//DEBUG
		//TODO:  Refine this.
		//Define point to check inside of target bound box.
		//adjust for translation of image.

		return (
			this.x < obj.x + obj.width &&
			this.x + this.width > obj.x &&
			this.y + this.height / 8 < obj.y + 2 * obj.height && //bottom
			this.y + this.height > obj.y + obj.height

		);
	};




	//1ST LEVEL OF INHERITANCE

	//define class for inanimate game actors
	var Inanimate = function Inanimate( id, name, imgSrc, sx, sy, sw, sh, x, y, width, height ) {
		//Ensure that any reference to "this" references the current object and not the prototype
		// Actor.call(name, x, y, width, height);
		//add properties specific to Inanimate objects;
		Actor.call( this, id, name, imgSrc, sx, sy, sw, sh, x, y, width, height );
	};
	//Create inheritance chain through prototype to base class Actor prototype
	Inanimate.prototype = Object.create( Actor.prototype );
	//Set the constructor for this object
	Inanimate.prototype.constructor = Inanimate;



	//define class for animated actors
	var Animate = function Animate( id, name, imgSrc, sx, sy, sw, sh, x, y, width, height ) {
		//Ensure that any reference to "this" references the current object and not the prototype
		// Actor.call(name, x, y, width, height);
		//add properties specific to Inanimate objects;
		Actor.call( this, id, name, imgSrc, sx, sy, sw, sh, x, y, width, height );
	};
	//Create inheritance chain through prototype to base class Actor prototype
	Animate.prototype = Object.create( Actor.prototype );
	//Set the constructor for this object
	Animate.prototype.constructor = Animate;
	//Add any additional properties specific to this object or its children to the prototype.
	Animate.prototype.axis = 'x';
	Animate.prototype.direction = 1;
	Animate.prototype.speed = 256;
	Animate.prototype.moved = false;

	//method to update the object's location based on current position, velocity and collisions.
	Animate.prototype.update = function ( dt ) {
		var bUp, bDown, bLeft, bRight;

		if ( this.moved ) {
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
			var tileUp = map.blockedTiles.indexOf( map.getTile( 0, map.getCol( this.x ), map.getRow( this.y - 64 ) ) ) >= 0;
			var tileDown = map.blockedTiles.indexOf( map.getTile( 0, map.getCol( this.x ), map.getRow( this.y + 5 ) ) ) >= 0;
			var tileLeft = map.blockedTiles.indexOf( map.getTile( 0, map.getCol( this.x - 5 ), map.getRow( this.y ) ) ) >= 0;
			var tileRight = map.blockedTiles.indexOf( map.getTile( 0, map.getCol( this.x + 64 ), map.getRow( this.y ) ) ) >= 0;

			//DEBUG: uncomment to debug
			//console.log("Blocks: " + tileUp,tileDown,tileLeft,tileRight);

			//get tile boundaries in pixels
			//
			bUp = 64 + ( this.height / 8 ); //Using 1/2 of sprite's height allows the sprite to move to the top unblocked
			bDown = 1088 - ( this.height / 2 ); //row and also have half their body over the top or under the bottom bounds for 3d-ish effect.
			bLeft = 64;
			bRight = map.maxX - 64;

			//DEBUG: uncomment to debug
			//console.log("bUp: " + bUp);
			//console.log("bDown: " + bDown);
			//console.log("bLeft: " + bLeft);
			//console.log("bRight: " + bRight);

			//create vector to hold the speed and direction of movement.
			var vector = Math.round( this.speed * this.direction * dt );

			//calculate direction and displacement in order to test the updated move
			//before accepting the move and allowing it to be rendered.
			if ( this.axis === "x" ) {
				//create xDisplace to hold potential new x value while it is tested
				var xDisplace = this.x + vector;
				//DEBUG
				//console.log("Displacement: " + xDisplace);

				if ( this.direction < 0 ) {
					if ( bLeft > xDisplace ) {
						this.x = bLeft;
					} else if ( tileLeft ) {
						//DEBUG
						// console.log("Can't move left")
					} else {
						this.x = xDisplace;
					}
				} else {
					if ( bRight < xDisplace ) {
						//DEBUG
						this.x = bRight;
					} else if ( tileRight ) {
						//can't move
					} else {
						this.x = xDisplace;
					}
				}

			} else {
				//create yDisplace to hold potential new y value while it is tested
				var yDisplace = this.y + vector;
				//DEBUG
				//console.log("Displacement: " + yDisplace);

				if ( this.direction < 0 ) {
					if ( bUp > yDisplace ) {
						this.y = bUp;
					} else if ( tileUp ) {
						//DEBUG
						//console.log("Can't move up")
					} else {
						this.y = yDisplace;
					}
				} else {
					if ( bDown < yDisplace ) {
						//DEBUG
						this.y = bDown;
					} else if ( tileDown ) {
						//console.log("Can't move down')
					} else {
						this.y = yDisplace;
					}
				}
			}
			//reset moved to false until user presses key to prevent automatic movement.
			this.moved = false;
		}
	};



	//2ND LEVEL OF INHERITANCE

	//define class for enemy - which the player must avoid.  This inherits from Animate.
	var Enemy = function Enemy( id, name, imgSrc, sx, sy, sw, sh, x, y, width, height, offsetTop, offsetBottom, offsetLeft, offsetRight, attackPattern, level ) {
		//Ensure that any reference to "this" references the current object and not the prototype
		Animate.call( this, id, name, imgSrc, sx, sy, sw, sh, x, y, width, height, offsetTop, offsetBottom, offsetLeft, offsetRight );
	};
	//Create inheritance chain through prototype to parent class Animate prototype
	Enemy.prototype = Object.create( Animate.prototype );
	//Set the constructor for this object
	Enemy.prototype.constructor = Enemy;
	Enemy.prototype.id = "";
	Enemy.prototype.name = "";
	Enemy.prototype.attackPattern = '';
	Enemy.prototype.level = "";
	Enemy.prototype.tickTock = 0;
	Enemy.prototype.soundIntro = "";
	Enemy.prototype.soundEffect = "";
	Enemy.prototype.startPosition = function () {
		this.x = x;
		this.y = y;
	};

	Enemy.prototype.update = function ( dt, newX, newY ) {
		switch ( this.attackPattern ) {
		case "sittingDuck":
			this.sittingDuck( dt );
			break;
		case "hongKongDingDong":
			this.hongKongDingDong( dt );
			break;
		case "barelySane-ders":
			this.barelysaneders( dt );
			break;
		case "guardDog":
			this.guardDog( dt );
			break;
		case "headHunter":
			this.headHunter( dt );
			break;
		case "usurper":
			this.usurper( dt );
			break;
		case "barkingMad":
			this.barkingMad( dt );
		}
	};

	Enemy.prototype.sittingDuck = function ( dt ) {
		//sits like a lame duck!
	};

	Enemy.prototype.hongKongDingDong = function ( dt ) {
		this.tickTock++;
		if ( this.tickTock === 100 ) {
			this.x = this.x + this.speed;
		} else if ( this.tickTock === 200 ) {
			this.x = this.x - this.speed;
			this.tickTock = 1;
		}
	};

	Enemy.prototype.barelysaneders = function () {
		var pick;
		var picked = {};
		var moves = [ {
				axis: "x",
				direction: -1
			}, {
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "y",
				direction: 1
			},
			{
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			},
			{
				axis: "y",
				direction: -1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			}, {
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			},
			{
				axis: "y",
				direction: 1
			}, {
				axis: "x",
				direction: 1
			}, {
				axis: "x",
				direction: -1
			}, {
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: -1
			},
			{
				axis: "y",
				direction: 1
			}, {
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			},
			{
				axis: "x",
				direction: -1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			},
			{
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "x",
				direction: 1
			},
			{
				axis: "x",
				direction: -1
			}, {
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "y",
				direction: 1
			},
			{
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			},
			{
				axis: "x",
				direction: -1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			},
			{
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "x",
				direction: 1
			},
			{
				axis: "x",
				direction: -1
			}, {
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "y",
				direction: 1
			},
			{
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			},
			{
				axis: "x",
				direction: -1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "y",
				direction: -1
			}, {
				axis: "x",
				direction: -1
			},
			{
				axis: "x",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "y",
				direction: 1
			}, {
				axis: "x",
				direction: 1
			} ];
		var axis;
		var direction;
		var vector;
		var minX = 448;
		var minY = 320;
		var maxX = 768;
		var maxY = 640;
		var inBounds;

		this.speed = 20;

		pick = Math.round( Math.random() * ( moves.length ) );
		//debug
		//console.log(pick);

		if ( pick !== 0 ) {
			pick = pick - 1;
		}
		picked = moves[ pick ];
		axis = picked.axis;
		direction = picked.direction;
		vector = Math.round( this.speed * direction );

		inBounds = false;
		do {
			if ( axis === "x" ) {
				if ( this.x + vector <= minX ) {
					this.x = minX;
				} else if ( this.x + vector >= maxX ) {
					this.x = maxX;
				} else {
					this.x = this.x + vector;
				}
			} else if ( axis === "y" ) {
				if ( this.y + vector <= minY ) {
					this.y = minY;
				} else if ( this.y + vector >= maxY ) {
					this.y = maxY;
				} else {
					this.y = this.y + vector;
				}
			}
		} while ( inBounds === false );
	};

	Enemy.prototype.guardDog = function ( dt ) {
		var gdMinY = 100,
			gdMidY = 512,
			gdMaxY = 950;
		//Enemy flies back and forth but stay in last row to guard the items
		//while lil Rubio headhunts.
		this.tickTock += 1;
		this.y = ( 450 * Math.sin( this.tickTock * 0.5 * Math.PI / ( 40 * 2 ) ) ) + 550;
	};

	Enemy.prototype.headHunter = function ( dt ) {
		var currX = this.x;
		var currY = this.y;

		//walks around the center square
		if ( currY === 240 ) {
			if ( currX <= 885 && currX != 305 ) {
				//walk to x=305
				this.x -= 2;
			}
		}
		if ( currY == 822 ) {
			if ( currX >= 305 && currX != 885 ) {
				this.x += 2;
			}
		}
		if ( currX === 305 ) {
			if ( currY >= 240 && currY != 822 ) {
				//walk to x=305
				this.y += 2;
			}
		}
		if ( currX === 885 ) {
			if ( currY <= 822 && currY != 240 ) {
				//walk to x=305
				this.y -= 2;
			}
		}
	};

	Enemy.prototype.usurper = function ( dt ) {

		var grid = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0 ],
            [ 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0 ],
            [ 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0 ],
            [ 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0 ],
            [ 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0 ],
            [ 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0 ],
            [ 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        ];



		var easystar = new EasyStar.js();

		easystar.setGrid( grid );

		easystar.setAcceptableTiles( [ 1 ] );
		easystar.setIterationsPerCalculation( 200 );

		easystar.findPath( map.getCol( this.x ), map.getRow( this.y ), map.getCol( player.x ), map.getRow( player.y ), function ( path ) {

			if ( path.length !== null && path.length > 1 ) {
				newX = path[ 1 ].x;
				newY = path[ 1 ].y;
			}
		} );

		easystar.calculate();

		var tileUp = map.blockedTiles.indexOf( map.getTile( 0, map.getCol( this.x ), map.getRow( this.y - 64 ) ) ) >= 0;
		var tileDown = map.blockedTiles.indexOf( map.getTile( 0, map.getCol( this.x ), map.getRow( this.y + 5 ) ) ) >= 0;
		var tileLeft = map.blockedTiles.indexOf( map.getTile( 0, map.getCol( this.x - 5 ), map.getRow( this.y ) ) ) >= 0;
		var tileRight = map.blockedTiles.indexOf( map.getTile( 0, map.getCol( this.x + 64 ), map.getRow( this.y ) ) ) >= 0;


		if ( map.getCol( this.x ) !== newX ) {
			if ( map.getCol( this.x ) < newX ) {
				if ( !tileRight ) {
					this.x += Math.floor( this.speed + dt );
				}
			} else if ( map.getCol( this.x ) > newX ) {
				if ( !tileLeft ) {
					this.x -= Math.floor( this.speed + dt );
				}
			}
		} else if ( map.getRow( this.y ) !== newY ) {
			if ( map.getRow( this.y ) < newY ) {
				if ( !tileDown ) {
					this.y += Math.floor( this.speed + dt );
				}
			} else if ( map.getRow( this.y ) > newY ) {
				if ( !tileUp ) {
					this.y -= Math.floor( this.speed + dt );
				}
			}
		}

	};

	Enemy.prototype.barkingMad = function ( dt ) {

		var grid = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0 ],
            [ 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0 ],
            [ 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0 ],
            [ 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0 ],
            [ 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        ];



		var easystar = new EasyStar.js();

		easystar.setGrid( grid );

		easystar.setAcceptableTiles( [ 0, 1 ] );
		easystar.setIterationsPerCalculation( 200 );
		easystar.enableDiagonals();
		easystar.enableCornerCutting();

		easystar.findPath( map.getCol( this.x ), map.getRow( this.y ), map.getCol( player.x ), map.getRow( player.y ), function ( path ) {

			if ( path.length !== null && path.length > 1 ) {
				newX = path[ 1 ].x;
				newY = path[ 1 ].y;
			}
		} );

		easystar.calculate();

		if ( map.getCol( this.x ) !== newX ) {
			if ( map.getCol( this.x ) < newX ) {
				this.x += Math.floor( this.speed + dt );
			} else if ( map.getCol( this.x ) > newX ) {
				this.x -= Math.floor( this.speed + dt );
			}
		} else if ( map.getRow( this.y ) !== newY ) {
			if ( map.getRow( this.y ) < newY ) {
				this.y += Math.floor( this.speed + dt );
			} else if ( map.getRow( this.y ) > newY ) {
				this.y -= Math.floor( this.speed + dt );
			}
		}

	};


	//define class for player character.  This inherits from Animate.
	var Player = function Player( id, name, imgSrc, sx, sy, sw, sh, x, y, width, height ) {
		//Ensure that any reference to "this" references the current object and not the prototype
		Animate.call( this, id, name, imgSrc, sx, sy, sw, sh, x, y, width, height );
	};
	//Create inheritance chain through prototype to parent class Animate prototype
	Player.prototype = Object.create( Animate.prototype );
	//Set the constructor for this object
	Player.prototype.constructor = Player;
	//method to handle keyboard input to update player sprite location.
	Player.prototype.handleInput = function ( keyCode ) {
		//code to take key request and update player direction.
		switch ( keyCode ) {
		case 'up':
			this.axis = 'y';
			this.direction = -1;
			break;
		case 'down':
			this.axis = 'y';
			this.direction = 1;
			break;
		case 'left':
			this.axis = 'x';
			this.direction = -1;
			break;
		case 'right':
			this.axis = 'x';
			this.direction = 1;
			break;
		case 'gloat':
			//add howler for random gloat. Stun enemy for 1 round.
			break;
		case 'insult':
			//add howler for random insult and stun enemies for 5 rounds. Can only be used 1x per level
			break;
		}
		this.moved = true;
	};



	//artifacts inherits from Inanimate
	var Artifact = function Artifact( id, name, imgSrc, sx, sy, sw, sh, x, y, width, height, offsetTop, offsetBottom, offsetLeft, offsetRight, enemyEffected, level ) {
		//Ensure that any reference to "this" references the current object and not the prototype
		Inanimate.call( this, id, name, imgSrc, sx, sy, sw, sh, x, y, width, height, offsetTop, offsetBottom, offsetLeft, offsetRight );
		this.enemyEffected = enemyEffected;
		this.level = level;
	};
	//Create inheritance chain through prototype to parent class Inanimate prototype
	Artifact.prototype = Object.create( Inanimate.prototype );
	//Set the constructor for this object
	Artifact.prototype.constructor = Artifact;
	//Add any additional properties specific to this object or its children to the prototype.
	Artifact.prototype.enemyEffected = "";
	Artifact.prototype.level = "";
	Artifact.prototype.captured = function captured() {
		console.log( "Destroyed Enemy: " + this.enemyEffected );
	};



	//3RD LEVEL OF INHERITANCE

	//method that creates an array of objects from a JSON array and an instantiated object - "Pseudo-Factory" pattern
	function objectFactory( arrayElement, protoObj ) {
		var results = [];

		for ( var i = 0; i < arrayElement.length; i++ ) {
			var currItem = arrayElement[ i ];
			var newObj = Object.create( protoObj.prototype );

			newObj.prototype = protoObj.prototype;
			newObj.prototype.constructor = protoObj;

			newObj.id = currItem.id;
			newObj.name = currItem.name;
			newObj.imgSrc = currItem.imgSrc;
			newObj.sx = currItem.sx;
			newObj.sy = currItem.sy;
			newObj.sw = currItem.sw;
			newObj.sh = currItem.sh;
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
			newObj.boxLeft = currItem.x + currItem.width - currItem.offsetLeft;
			newObj.boxRight = currItem.x + currItem.offsetLeft;
			if ( newObj.enemyEffected !== undefined ) {
				newObj.enemyEffected = currItem.enemyEffected;
			}
			if ( newObj.soundIntro !== undefined ) {
				newObj.soundIntro = currItem.soundIntro;
			}
			if ( newObj.soundEffect !== undefined ) {
				newObj.soundEffect = currItem.soundEffect;
			}
			if ( newObj.attackPattern !== undefined ) {
				newObj.attackPattern = currItem.attackPattern;
			}
			newObj.level = currItem.level;

			results.push( newObj );
		}

		return results;
	}

	//create enemy objects
	var enemyList = [
		{
			"id": "carson",
			"name": "TurDuckarson",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 853,
			"sy": 267,
			"sw": 101,
			"sh": 126,
			"x": 640,
			"y": 512,
			"width": 75,
			"height": 95,
			"offsetTop": 1,
			"offsetBottom": 5,
			"offsetLeft": 15,
			"offsetRight": 6,
			"speed": 0,
			"soundIntro": "bababa",
			"soundEffect": "carson",
			"attackPattern": "lameDuck",
			"level": 1
		},
		{
			"id": "kasich",
			"name": "HongKongKasich",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 714,
			"sy": 267,
			"sw": 135,
			"sh": 109,
			"x": 384,
			"y": 512,
			"width": 136,
			"height": 130,
			"offsetTop": 1,
			"offsetBottom": 5,
			"offsetLeft": 15,
			"offsetRight": 6,
			"speed": 384,
			"soundIntro": "tough_guy",
			"soundEffect": "kasich",
			"attackPattern": "hongKongDingDong",
			"level": 2
		},
		{
			"id": "cruz",
			"name": "Lyin Ted",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 3,
			"sy": 262,
			"sw": 101,
			"sh": 171,
			"x": 1152,
			"y": 512,
			"width": 65,
			"height": 110,
			"offsetTop": 1,
			"offsetBottom": 1,
			"offsetLeft": 16,
			"offsetRight": 9,
			"speed": 5,
			"soundIntro": "lyin_ted",
			"soundEffect": "cruz",
			"attackPattern": "guardDog",
			"level": 4
		},
		{
			"id": "hillary",
			"name": "Hilantula",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 236,
			"sy": 3,
			"sw": 145,
			"sh": 124,
			"x": 640,
			"y": 384,
			"width": 90,
			"height": 80,
			"offsetTop": 3,
			"offsetBottom": 1,
			"offsetLeft": 7,
			"offsetRight": 7,
			"speed": 1,
			"soundIntro": "Hilantura",
			"soundEffect": "hillary_bark",
			"attackPattern": "barkingMad",
			"level": 6
		},
		{
			"id": "romney",
			"name": "The Usurper",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 108,
			"sy": 87,
			"sw": 101,
			"sh": 171,
			"x": 640,
			"y": 130,
			"width": 65,
			"height": 110,
			"offsetTop": 1,
			"offsetBottom": 1,
			"offsetLeft": 1,
			"offsetRight": 2,
			"speed": 1,
			"soundIntro": "usurper",
			"soundEffect": "usurper_all_mine",
			"attackPattern": "usurper",
			"level": 5
		},
		{
			"id": "rubio",
			"name": "Lil Marco",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 213,
			"sy": 306,
			"sw": 101,
			"sh": 162,
			"x": 885,
			"y": 240,
			"width": 65,
			"height": 110,
			"offsetTop": 14,
			"offsetBottom": 2,
			"offsetLeft": 1,
			"offsetRight": 7,
			"speed": 6,
			"soundIntro": "lil_guy",
			"soundEffect": "rubio",
			"attackPattern": "headHunter",
			"level": 4
		},
		{
			"id": "sanders",
			"name": "Lenin Marx",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 108,
			"sy": 262,
			"sw": 101,
			"sh": 171,
			"x": 640,
			"y": 640,
			"width": 65,
			"height": 110,
			"offsetTop": 1,
			"offsetBottom": 1,
			"offsetLeft": 8,
			"offsetRight": 8,
			"speed": 20,
			"soundIntro": "Commie",
			"soundEffect": "bernie",
			"attackPattern": "barelySane-ders",
			"level": 3
		}
    ];
	//create enemy array
	//create an instance of Enemy to run in the objectFactory
	var enemy = new Enemy();
	enemy.prototype = Enemy.prototype;
	enemy.prototype.constructor = Enemy;

	//use array to hold all artifacts created through the factory method.
	// Place all enemy objects in an array called allEnemies
	var allEnemies = objectFactory( enemyList, enemy );


	//create artifact objects
	var artifactList = [
		{
			"id": "stand",
			"name": "Debate Stand",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 913,
			"sy": 3,
			"sw": 76,
			"sh": 128,
			"x": 540,
			"y": 511,
			"width": 50,
			"height": 100,
			"offsetTop": 5,
			"offsetBottom": 1,
			"offsetLeft": 16,
			"offsetRight": 10,
			"enemyEffected": "carson",
			"level": 1
		},
		{
			"id": "belt",
			"name": "White Belt",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 108,
			"sy": 437,
			"sw": 100,
			"sh": 45,
			"x": 540,
			"y": 512,
			"width": 67,
			"height": 40,
			"offsetTop": 5,
			"offsetBottom": 1,
			"offsetLeft": 16,
			"offsetRight": 10,
			"enemyEffected": "kasich",
			"level": 2
		},
		{
			"id": "birthCert",
			"name": "Birth Certificate",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 3,
			"sy": 437,
			"sw": 101,
			"sh": 62,
			"x": 1152,
			"y": 120,
			"width": 52,
			"height": 30,
			"offsetTop": 0,
			"offsetBottom": 0,
			"offsetLeft": 0,
			"offsetRight": 0,
			"enemyEffected": "cruz",
			"level": 4
		},
		{
			"id": "server",
			"name": "Mail Server",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 714,
			"sy": 380,
			"sw": 101,
			"sh": 101,
			"x": 1160,
			"y": 945,
			"width": 45,
			"height": 75,
			"offsetTop": 55,
			"offsetBottom": 19,
			"offsetLeft": 2,
			"offsetRight": 1,
			"enemyEffected": "hillary",
			"level": 6
		},
		{
			"id": "playbill",
			"name": "Playbill",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 819,
			"sy": 397,
			"sw": 86,
			"sh": 120,
			"x": 1152,
			"y": 120,
			"width": 50,
			"height": 85,
			"offsetTop": 26,
			"offsetBottom": 5,
			"offsetLeft": 5,
			"offsetRight": 5,
			"enemyEffected": "romney",
			"level": 5
		},
		{
			"id": "heart",
			"name": "Bleeding Heart",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 3,
			"sy": 87,
			"sw": 101,
			"sh": 171,
			"x": 780,
			"y": 352,
			"width": 50,
			"height": 85,
			"offsetTop": 5,
			"offsetBottom": 1,
			"offsetLeft": 5,
			"offsetRight": 5,
			"enemyEffected": "sanders",
			"level": 3
		},
		{
			"id": "bottle",
			"name": "Water Bottle",
			"imgSrc": "images/_textures/spritesheet.png",
			"sx": 958,
			"sy": 135,
			"sw": 50,
			"sh": 110,
			"x": 1170,
			"y": 950,
			"width": 35,
			"height": 70,
			"offsetTop": 24,
			"offsetBottom": 5,
			"offsetLeft": 8,
			"offsetRight": 8,
			"enemyEffected": "rubio",
			"level": 4
		}
    ];



	//create an instance of Artifact to run in the objectFactory
	var artifact = new Artifact();
	artifact.prototype = Artifact.prototype;
	artifact.prototype.constructor = Artifact;


	//use array to hold all artifacts created through the factory method.
	var artifacts = objectFactory( artifactList, artifact );

	//create array to hold artifacts and enemies per level
	var lvlEnemies = [],
		lvlArtifacts = [];
	var level = [];

	//No Level #0 so fill the first element to prevent errors.
	level.push( [ "lvlEnemies", "lvlArtifacts" ] );

	//Populate the levels.
	for ( var lvl = 1; lvl <= Math.max( allEnemies.length, artifacts.length ) - 1; lvl++ ) {
		lvlEnemies = [];
		lvlArtifacts = [];

		lvlEnemies = allEnemies.filter( function ( item ) {
			return item.level === lvl;
		} );

		lvlArtifacts = artifacts.filter( function ( item ) {
			return item.level === lvl;
		} );

		level.push( [ lvlEnemies, lvlArtifacts ] );
	}

	// Place the player object in a variable called player
	var player = new Player( "trump", 'The Donald', 'images/_textures/spritesheet.png', 318, 131, 57, 171, 92, 518, 57, 171 ); //set initial y-pos so feet are center tile.
	//Create inheritance chain through prototype to parent class
	player.prototype = Player.prototype;
	//Set the constructor for this object
	player.prototype.constructor = Player;
	//set properties
	player.ego = 50;
	player.speed = 1024;
	player.offsetTop = 8;
	player.offsetBottom = 1;
	player.offsetLeft = 13;
	player.offsetRight = 20;
	player.calcSides();
	player.prototype.startPosition = function () {
		player.x = 92;
		player.y = 518;
	};


	// This listens for key presses and sends the keys to your
	// Player.handleInput() method.
	window.addEventListener( 'keydown', function ( e ) {
		var allowedKeys = {
			37: 'left', //arrow left
			65: 'left', //'A' key
			38: 'up', //arrow up
			87: 'up', //'W' key
			39: 'right', //arrow right
			68: 'right', //'D' key
			40: 'down', //arrow down
			83: 'down', //'S' key
			80: 'reset', //'P' key
			32: 'continue' //space bar to continue.

		};

		window.addEventListener( 'keyup', function ( e ) {
			delete e.keyCode;
		} );
		console.log( allowedKeys[ e.keyCode ] );

		if ( allowedKeys[ e.keyCode ] === 'pause' ) {
			pauseToggle();
		}
		if ( allowedKeys[ e.keyCode ] === 'reset' ) {
			reset();
		}
		//else
		//event sends keys to player.handleInput
		player.handleInput( allowedKeys[ e.keyCode ] );
	} );

	//expose specific objects to the global scope.
	global.player = player;
	global.artifacts = artifacts;
	global.allEnemies = allEnemies;
	global.level = level;
	global.lvlEnemies = lvlEnemies;
	global.lvlArtifacts = lvlArtifacts;

} )( this );
