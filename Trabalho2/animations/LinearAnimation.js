
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
        let scaledT = time % this.time;

        //Next control point
        let nextPoint = Math.ceil(scaledT * this.pts.length / this.time);

        //Previous control point
        let previousPoint = nextPoint - 1;
        if (previousPoint < 0) {
            previousPoint = 0;
        }

        //Vector from previous to next
        let vec = {
            x: pts[nextPoint].x - pts[previousPoint].x,
            y: pts[nextPoint].y - pts[previousPoint].y,
            z: pts[nextPoint].z - pts[previousPoint].z
        }

        //Magnitude
        let mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);

        //If magnitude is 0 what to do?
        //Just use magnitude 1 for simplicity, still shouldn't happen
        if(mag == 0)
            mag = 1;

        //Normalize
        vec.x /= mag;
        vec.y /= mag;
        vec.z /= mag;

        //Time per transition
        let transitionT = this.time / this.pts.length;

        //Time at next control point
        let timeNext = transitionT * nextPoint;

        //Time at previous control point
        let timePrevious = transitionT * previousPoint;

        //Current time percentage of time difference between control points
        scaledT -= timePrevious;
        timeNext -= timePrevious;
        let percentageT = scaledT / timeNext;

        //Desired magnitude
        let desiredMag = mag * percentageT;

        //Apply magnitude
        vec.x *= desiredMag;
        vec.y *= desiredMag;
        vec.z *= desiredMag;

        //http://glmatrix.net/docs/

        //Final position
        let pos = vec3.fromValues(pts[previousPoint].x + vec.x, pts[previousPoint].y + vec.y, pts[previousPoint].z + vec.z);

        //Apply to matrix;
        mat4.translate(this.transformationMat, this.transformationMat, pos);

    }

}