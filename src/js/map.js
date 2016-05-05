var gameMap = (function(global) {

    "use strict";

    var Map = function Map() {
        this.cols = 1;
        this.rows = 1;
        this.tsize = 1;
        this.layers = [];
        this.tiles = [];
        this.maxX = 1;
        this.maxY = 1;
    };

    Map.prototype.getTile = function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    };

    Map.prototype.isSolidTileAtXY = function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // impassible tiles are in the array map.blockedTiles -- the rest are walkable.
        // Keeping that in an array makes the assignment of new or existing tiles as blocked dynamic.
        // Loop through each map layer and return TRUE if any tile is in map.blockedTiles
        return this.layers.reduce(function (result, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = this.blockedTiles.indexOf(tile) >=0;
            return result || isSolid;
        }.bind(this), false);
    };

    Map.prototype.getCol = function (x) {
        return Math.floor(x / this.tsize);
    };

    Map.prototype.getRow = function (y) {
        return Math.floor(y / this.tsize);
    };

    Map.prototype.getX = function (col) {
        return col * this.tsize;
    };

    Map.prototype.getY = function (row) {
        return row * this.tsize;
    };

    Map.prototype._drawLayer = function (layer) {
        var ctxGeo,ctxAction,ctxScenery;

        switch (layer) {
            case 0:
                var ctxGeo = global.ctxGeo;
                break;
            case 1:
                var ctxAction = global.ctxAction;
                break;
            case 2:
                var ctxScenery = global.ctxScenery;
                break;
        }

        for (var c = 0; c <= this.cols - 1; c++) {
            for (var r = 0; r <= this.rows - 1; r++) {
                var tile = this.getTile(layer, c, r);
                var x = c * this.tsize;
                var y = r * this.tsize;

                //Iterate through tiles and handle per case.
                if (tile !== 0) { // 1 => empty tile
                    switch (tile) {
                        case 1: //'images/tiles/grass.png'
                            ctxGeo.drawImage(Resources.get('images/_textures/spritesheet.png'),909,397,64,64,x,y,this.tsize,this.tsize);
                            break;
                        case 2: //'images/tiles/pavers.png'
                            ctxGeo.drawImage(Resources.get('images/_textures/spritesheet.png'),318,442,64,64,x,y,this.tsize,this.tsize);
                            break;
                        case 13: //'images/tiles/wall_corner.png'
                            ctxGeo.drawImage(Resources.get('images/_textures/spritesheet.png'),454,442,64,64,x,y,this.tsize,this.tsize);
                            break;
                        case 14: //'images/tiles/wall_vertical.png'
                            ctxGeo.drawImage(Resources.get('images/_textures/spritesheet.png'),590,442,64,64,x,y,this.tsize,this.tsize);
                            break;
                        case 15: //'images/tiles/wall_horizontal.png'
                            ctxGeo.drawImage(Resources.get('images/_textures/spritesheet.png'),522,442,64,64,x,y,this.tsize,this.tsize);
                            break;
                        case 16:
                            ctxGeo.drawImage(Resources.get('images/_textures/spritesheet.png'),909,397,64,64,x,y,this.tsize,this.tsize);
                            break;
                        case 3: //'images/tiles/rock.png', //3
                            ctxScenery.drawImage(Resources.get('images/_textures/spritesheet.png'),386,442,64,64,x,y,this.tsize,this.tsize);
                            break;
                        case 4: //'images/tiles/tree.png'
                            ctxScenery.drawImage(Resources.get('images/_textures/spritesheet.png'),589,135,101,171,x - 20,y - 120,101,171);
                            break;
                        case 5:  //'images/tiles/pink_tree.png'
                            ctxScenery.drawImage(Resources.get('images/_textures/spritesheet.png'),484,135,101,171,x - 20,y - 120,101,171);
                            break;
                        case 6: //'images/tiles/green_tree.png'
                            ctxScenery.drawImage(Resources.get('images/_textures/spritesheet.png'),379,135,101,171,x - 20,y - 120,101,171);
                            break;
                    }

                    //enable the next 6 lines to draw a debugging grid for collision checks and
                    // placement of objects in the Action layer.
                    /*if(layer === 0) {
                        ctxGeo.beginPath();
                        ctxGeo.font = "9pt sans-serif";
                        ctxGeo.strokeText(r + ", " + c, x +20, y + 36);
                        ctxGeo.strokeRect(x, y, 64, 64);
                        ctxGeo.closePath()
                    }*/
                }
            }
        }
    };



    var map = new Map();

    map.cols = 20;
    map.rows = 16;
    map.tsize = 64;
    map.maxX = map.cols * map.tsize;
    map.maxY = map.rows * map.tsize;
    map.tiles = ['blank',//0 [transparent spacer to allow movement]
        'images/tiles/grass.png', //1
        'images/tiles/pavers.png', //2
        'images/tiles/rock.png', //3
        'images/tiles/tree.png', //4
        'images/tiles/pink_tree.png',//5
        'images/tiles/green_tree.png', //6
        'images/artifacts/birth_certificate.png', //7
        'images/artifacts/debate_stand.png', //8
        'images/artifacts/mail_server.png', //9
        'images/artifacts/playbill.png', //10
        'images/artifacts/bleeding_heart.png', //11
        'images/artifacts/water_bottle.png', //12
        'images/tiles/wall_corner.png', //13
        'images/tiles/wall_vertical.png', //14
        'images/tiles/wall_horizontal.png', //15
        'images/tiles/grass.png'   //16 blocked version of grass to place under trees and rocks
    ];
    map.walkableTiles = [0,1,2];
    map.blockedTiles = [3,4,5,6,13,14,15,16];

    map.layers = [[    //Geo
       13,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,13,
       14, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,14,
       14, 2,16,16, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1,16,16, 2,14,
       14, 2,16, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1,16, 2,14,
       14, 2,16, 1, 1, 1,13,15,15, 2, 2,15,15,13, 1, 1, 1,16, 2,14,
       14, 2, 1, 1, 1, 1,14, 1, 1, 2, 2, 1, 1,14, 1, 1, 1, 1, 2,14,
       14, 2, 1, 1, 1, 1,14, 1, 1, 2, 2, 1, 1,14, 1, 1, 1, 1, 2,14,
       14, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,14,
       14, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,14,
       14, 2, 1, 1, 1, 1,14, 1, 1, 2, 2, 1, 1,14, 1, 1, 1, 1, 2,14,
       14, 2, 1, 1, 1, 1,14, 1, 1, 2, 2, 1, 1,14, 1, 1, 1, 1, 2,14,
       14, 2, 1, 1, 1, 1,13,15,15, 2, 2,15,15,13, 1, 1, 1, 1, 2,14,
       14, 2,16, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1,16, 2,14,
       14, 2,16, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1,16, 2,14,
       14, 2,16,16,16, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1,16,16,16, 2,14,
       13,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,13
    ], [       //Action
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],[         //Scenery
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0,
       0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0,
       0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0,
       0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0,
       0, 0, 5, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
    ];


    global.map = map

})(this);