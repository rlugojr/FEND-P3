var HUD = (function(global){

    var AnyMeter = function AnyMeter() {
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


    global.egometer = egometer;

})(this);
