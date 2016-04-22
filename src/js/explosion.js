/**
 * Created by rlugojr on 4/5/2016.
 */
var Explosions = (function(global) {
    var Explosion = function (targetX, targetY, options) {
        this.frames = [
            {"x": 656, "y": 33, "w": 17, "h": 16, "length": .1},
            {"x": 687, "y": 1, "w": 26, "h": 25, "length": .1},
            {"x": 656, "y": 1, "w": 30, "h": 29, "length": .1},
            {"x": 620, "y": 1, "w": 35, "h": 34, "length": .1},
            {"x": 581, "y": 1, "w": 38, "h": 37, "length": .1},
            {"x": 537, "y": 1, "w": 43, "h": 42, "length": .1},
            {"x": 491, "y": 1, "w": 44, "h": 46, "length": .1},
            {"x": 442, "y": 1, "w": 48, "h": 47, "length": .1},
            {"x": 390, "y": 1, "w": 50, "h": 50, "length": .1},
            {"x": 228, "y": 1, "w": 52, "h": 50, "length": .1},
            {"x": 282, "y": 1, "w": 52, "h": 50, "length": .1},
            {"x": 58, "y": 1, "w": 52, "h": 51, "length": .1},
            {"x": 1, "y": 1, "w": 51, "h": 55, "length": .1},
            {"x": 112, "y": 1, "w": 50, "h": 57, "length": .1},
            {"x": 171, "y": 1, "w": 50, "h": 55, "length": .1},
            {"x": 336, "y": 1, "w": 50, "h": 52, "length": .1}
        ];
        this.active = true;
        this.imgSrc = 'images/effects/explosion.png';
        this.options = options || {
                repeats: false,
                keyframe: 0
            };
        this.length = 15;
        this.frame = this.frames[this.index];
        this.index = 0;
        this.elapsed = 0;
        this.targetX = targetX;
        this.targetY = targetY;
    };

    Explosion.prototype.constructor = Explosion;
    Explosion.prototype.frames = '';
    Explosion.prototype.active = true;
    Explosion.prototype.imgSrc = '';
    Explosion.prototype.length=15;
    Explosion.prototype.frame = {};
    Explosion.prototype.index = 0;
    Explosion.prototype.elapsed = 0;
    Explosion.prototype.targetX = 0;
    Explosion.prototype.targetY = 0;

    Explosion.prototype.reset = function () {
        this.elapsed = 0;
        this.index = 0;
        this.frame = this.frames[this.index]
    };

    Explosion.prototype.update = function (dt) {
        this.elapsed = this.elapsed + dt;

        if (this.elapsed >= this.frame.length) {
            this.index++;
            this.elapsed = this.elapsed - this.frame.length;
        }

        if (this.index >= this.length) {
            if (this.options.repeats) {
                this.index = this.options.keyframe;
            } else {
                this.active = false
            }
        }else {
            this.frame = this.frames[this.index]
        }
    };

    Explosion.prototype.playSounds = function(){
        sounds.play("fired");
        sounds.play("explosion")
    };

    Explosion.prototype.render = function (ctx) {
        //explosion size increases with each progressing level.
        ctx.drawImage(Resources.get(this.imgSrc), this.frame.x, this.frame.y,
            this.frame.w, this.frame.h, this.targetX, this.targetY,
            this.frame.w * gameState.level, this.frame.h * gameState.level
        )

    };


    var newExplosion = function (targetX, targetY, options) {
        Explosion.call(this, targetX, targetY, options);
    };

    newExplosion.prototype = Object.create(Explosion.prototype);
    newExplosion.prototype.constructor = Explosion;

    global.newExplosion = newExplosion

})(this);


