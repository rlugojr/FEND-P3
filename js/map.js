var gameMap = (function(global) {

    "use strict";

    var Map = function Map(){
        this.cols = 0;
        this.rows = 0;
        this.tileSize = 0;
        this.layers = [];
        this.tiles = [];
        this.maxX = 0;
        this.maxY = 0;
    };

    Map.prototype.getTile = function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    };

    Map.prototype.isSolidTileAtXY = function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // tiles 3 and 5 are solid -- the rest are walkable
        // loop through all layers and return TRUE if any tile is solid
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = tile === 3 || tile === 5;
            return res || isSolid;
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

    Map.prototype._drawLayer = function (ctx) {
        /*var startCol = Math.floor(this.camera.x / map.tsize);
        var endCol = startCol + (this.camera.width / map.tsize);
        var startRow = Math.floor(this.camera.y / map.tsize);
        var endRow = startRow + (this.camera.height / map.tsize);
        var offsetX = -this.camera.x + startCol * map.tsize;
        var offsetY = -this.camera.y + startRow * map.tsize;
        */
        for (var c = 0; c <= this.maxX; c++) {
            for (var r = 0; r <= this.maxY; r++) {
                var tile = map.getTile(layer, c, r);
                var x = c * map.tsize;
                var y = r * map.tsize;
                if (tile !== 0) { // 0 => empty tile
                    this.ctx.drawImage(
                        this.tiles[tile], // image
                        0, // source x
                        0, // source y
                        map.tsize, // source width
                        map.tsize, // source height
                        Math.round(x),  // target x
                        Math.round(y), // target y
                        map.tsize, // target width
                        map.tsize // target height
                    );
                }
            }
        }
    };

    var map = new Map();
    map.prototype = Object.create(Map.prototype);
    map.prototype.constructor = map;

    map.cols = 24;
    map.rows = 24;
    map.tsize = 64;
    map.maxX = map.cols * map.tileSize;
    map.tiles = ['images/tiles/grass.png',
        'images/tiles/pavers.png',
        'images/tiles/rock.png',
        'images/tiles/tree.png',
        'images/tiles/pink_tree.png',
        'images/tiles/green_tree.png',
        'images/artifacts/birth_certificate.png',
        'images/artifacts/debate_stand.png',
        'images/artifacts/mail_server.png',
        'images/artifacts/playbill.png',
        'images/artifacts/socialist_pin.png',
        'images/artifacts/water_bottle.png'
    ];

    map.layers = [[
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3,
        3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
        3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3
    ], [
        4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3
    ]];




})(this);