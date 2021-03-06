var HUD = (function(global){

    /* This function displays notifications to the player*/
    var hudMessage = function hudMessage(ctx, message, frameColor, fontColor) {
        ctx.font = "Bold 64px 'Ready 2P'";
        ctx.textAlign = "center";
        //ctx.fillStyle = frameColor;
        ctx.strokeStyle = fontColor;
        //ctx.fillRect(0, 120, ctx.canvas.width, 140);
        //ctx.strokeRect(0, 120, ctx.canvas.width, 140);
        ctx.fillStyle = fontColor;
        ctx.fillText(message, ctx.canvas.width/2, ctx.canvas.height/2)
    };

    var hudImage = function hudImage(ctxUI, image, displayTime){
        this.elapsed=0;
        this.displayTime = 120; //2 secs
        this.displayImage = function () {
            ctxUI.clearRect(0, 0, ctxUI.canvas.width, ctxUI.canvas.height);
            ctxUI.drawImage(Resources.get('effects/bang.png'), ctxUI.canvas.width / 2, ctx.canvas.height / 2);
        }
    };



    //This creates a parent prototype for a circular progress bar.
/*    var AnyMeter = function AnyMeter() {
        this.percentage = 0 / 100;


        this.x = 40;
        this.y = 40;
        this.r = 30;
        this.s = 1.5 * Math.PI;
    };

    AnyMeter.prototype.constructor = AnyMeter;

    AnyMeter.prototype.update = function(currVal, meterName){
        this.percentage = Math.floor(currVal / 100);
        this.degrees = this.percentage * 360.0;
        this.radians = this.degrees * (Math.PI / 180);
        this.meterName = meterName;
    };

    AnyMeter.prototype.render = function(ctx){
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.fillStyle = 'red';
        ctx.strokeStyle = "red";
        ctx.textAlign = 'center';
        ctx.fillText((Math.floor(this.percentage*100))+'%', 40, 45);
        ctx.arc(this.x, this.y, this.r, this.s, this.radians+this.s, false);
        ctx.fillText(this.meterName, 40, 90);
        ctx.stroke();

    };

    var egometer = new AnyMeter();
    egometer.prototype = AnyMeter.prototype;
    egometer.prototype.constructor = AnyMeter;

    egometer.percentage = 1;
    egometer.meterName = 'Ego';
    global.egometer = egometer;*/

    global.hudMessage = hudMessage;


})(this);
