
class LinearAnimation extends Animation {

    /**
     * @constructor
     */
    constructor(scene, pts, time) {
        super(scene);
        this.scene = scene;

        this.pts = pts;
        this.time = time;
    }

    update(time) {

        //Scale time
        var scaledT = time % this.time;

        //Next control point
        var nextPoint = Math.ceil(scaledT * this.pts.length / this.time);

        //Previous control point
        var previousPoint = nextPoint - 1;
        if (previousPoint < 0) {
            previousPoint = 0;
        }

        //Vector from previous to next
        var vec = {
            x: pts[nextPoint].x - pts[previousPoint].x,
            y: pts[nextPoint].y - pts[previousPoint].y
        }

        //Magnitude
        var mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

        //If magnitude is 0 what to do?
        //Just use magnitude 1 for simplicity, still shouldn't happen
        if(mag == 0)
            mag = 1;

        //Normalize
        vec.x /= mag;
        vec.y /= mag;

        //Time per transition
        var transitionT = this.time / this.pts.length;

        //Time at next control point
        var timeNext = transitionT * nextPoint;

        //Time at previous control point
        var timePrevious = transitionT * previousPoint;

        //Current time percentage of time difference between control points
        scaledT -= timePrevious;
        timeNext -= timePrevious;
        var percentageT = scaledT / timeNext;

        //Desired magnitude
        var desiredMag = mag * percentageT;

        //Apply magnitude
        vec.x *= desiredMag;
        vec.y *= desiredMag;

        //Final position
        var pos = {
            x: pts[previousPoint].x + vec.x,
            y: pts[previousPoint].y + vec.y
        }

        //TODO create a matrix transformation from this
        //use transformationMat from Animation.js

    }

}