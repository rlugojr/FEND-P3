/**
 * Created by rlugojr on 3/23/2016.
 */

var Animations = (function(global){


    function AnimationData(frames, imgSrc, options) {
        this.frames = frames || [{ x: 0, y: 0, w: 0, h: 0, length: 0 }];
        this.imgSrc = imgSrc;
        this.options = options || {
                repeats: false,
                keyframe: 0
            };
    }

    /**
     Each object would have one of these to play any animation back.
     */
    function AnimationPlayer(animation, x, y) {
        var ani = animation || new AnimationData();
        this.length = 0;
        this.frame = undefined;
        this.index = 0;
        this.elapsed = 0;
        this.x = x;
        this.y = y;

        this.setAnimation(ani);
        this.reset();
    }

    AnimationPlayer.prototype.reset = function() {
        this.elapsed = 0;
        this.index = 0;
        this.frame = this.animation.frames[this.index];
    };

    AnimationPlayer.prototype.nukeTarget = function(obj){
        this.x = obj.x;
        this.y = obj.y;

        this.reset()
    };

    AnimationPlayer.prototype.update = function(dt) {
        this.elapsed = this.elapsed + dt;

        if(this.elapsed >= this.frame.length) {
            this.index++;
            this.elapsed = this.elapsed - this.frame.length;
        }

        if(this.index >= this.length) {
            if(this.animation.options.repeats) {
                this.index = this.animation.options.keyframe;
            } else {
                this.index--;
            }
        }

        this.frame = this.animation.frames[this.index];
    };

    AnimationPlayer.prototype.render = function(ctx){
        ctx.drawImage(Resources.get(this.animation.imgSrc), this.frame.x, this.frame.y,
            this.frame.w, this.frame.h, this.x, this.y,
            this.frame.w*2, this.frame.h*2
        )
    };

    AnimationPlayer.prototype.setAnimation = function(animation, reset) {
        this.animation = animation;
        this.length = this.animation.frames.length;
    };

    var explodeFrames = [
        {"x":656,"y":33,"w":17,"h":16,"length":.1},
        {"x":687,"y":1,"w":26,"h":25,"length":.1},
        {"x":656,"y":1,"w":30,"h":29,"length":.1},
        {"x":620,"y":1,"w":35,"h":34,"length":.1},
        {"x":581,"y":1,"w":38,"h":37,"length":.1},
        {"x":537,"y":1,"w":43,"h":42,"length":.1},
        {"x":491,"y":1,"w":44,"h":46,"length":.1},
        {"x":442,"y":1,"w":48,"h":47,"length":.1},
        {"x":390,"y":1,"w":50,"h":50,"length":.1},
        {"x":228,"y":1,"w":52,"h":50,"length":.1},
        {"x":282,"y":1,"w":52,"h":50,"length":.1},
        {"x":58,"y":1,"w":52,"h":51,"length":.1},
        {"x":1,"y":1,"w":51,"h":55,"length":.1},
        {"x":112,"y":1,"w":50,"h":57,"length":.1},
        {"x":171,"y":1,"w":50,"h":55,"length":.1},
        {"x":336,"y":1,"w":50,"h":52,"length":.1}
    ];

    var explosion = new AnimationData(explodeFrames,'images/effects/explosion.png', {repeats: false,keyframe: 0});
    var newExplosion = new AnimationPlayer(explosion,512,512);
    newExplosion.prototype = AnimationPlayer.prototype;
    newExplosion.prototype.constructor = AnimationPlayer;

    global.newExplosion = newExplosion




})(this);


