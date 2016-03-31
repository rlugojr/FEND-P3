/**
 * Created by rlugojr on 3/23/2016.
 */

var Animations = (function(global){


    function AnimationData(frames,imgSrc, options) {
        this.frames = frames || [{ x: 0, y: 0, w: 0, h: 0, length: 0 }];
        this.imgSrc = imgSrc;
        this.image = new Image(imgSrc);
        this.options = options || {
                repeats: false,
                keyframe: 0
            };
    }

    /**
     Each object would have one of these to play any animation back.
     */
    function AnimationPlayer(animation,x,y) {
        this.animation = animation;
        this.frame = 0;
        this.index = 0;
        this.elapsed = 0;
        this.x = x;
        this.y = y;

        this.length = animation.frames.length;


        this.reset();
    }

    AnimationPlayer.prototype.reset = function() {
        this.elapsed = 0;
        this.index = 0;
        this.frame = this.animation.frames[this.index];
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

    AnimationPlayer.prototype.render = function() {
        ctxAction.drawImage(
            this.animation.image,
            this.animation.frame.x,
            this.animation.frame.y,
            this.animation.frame.w,
            this.animation.frame.h,
            0,
            0,
            this.animation.frame.w,
            this.animation.frame.h);
    };

explodeFrames = [
       {"x":656,"y":33,"w":17,"h":16,"length":1},
       {"x":687,"y":1,"w":26,"h":25,"length":1},
       {"x":656,"y":1,"w":30,"h":29,"length":1},
       {"x":620,"y":1,"w":35,"h":34,"length":1},
       {"x":581,"y":1,"w":38,"h":37,"length":1},
       {"x":537,"y":1,"w":43,"h":42,"length":1},
       {"x":491,"y":1,"w":44,"h":46,"length":1},
       {"x":442,"y":1,"w":48,"h":47,"length":1},
       {"x":390,"y":1,"w":50,"h":50,"length":1},
       {"x":228,"y":1,"w":52,"h":50,"length":1},
       {"x":282,"y":1,"w":52,"h":50,"length":1},
       {"x":58,"y":1,"w":52,"h":51,"length":1},
       {"x":1,"y":1,"w":51,"h":55,"length":1},
       {"x":112,"y":1,"w":50,"h":57,"length":1},
       {"x":171,"y":1,"w":50,"h":55,"length":1},
       {"x":336,"y":1,"w":50,"h":52,"length":1},
        {
            repeats: true,
            keyframe: 0
        }
    ];




})(this);


