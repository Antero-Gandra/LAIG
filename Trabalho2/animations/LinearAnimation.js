
class LinearAnimation extends Animation {

    /**
     * @constructor
     */
    constructor(scene, pts, span) {
        super(scene);
        this.scene = scene;

        this.pts = pts;
        this.span = span;

        //Hardcoded front in direction of positive Z axis
        this.forward = vec2.fromValues(0, 1);
    }

    update(time) {

        //Scale time
        let scaledT = time % this.span;

        //Time per transition
        let transitionT = (this.span / (this.pts.length - 1));

        //Next control point
        let nextPoint = Math.ceil(scaledT / transitionT);
        if (nextPoint == 0 || nextPoint > this.pts.length - 1) {
            nextPoint = 1;
        }

        //Previous control point
        let previousPoint = nextPoint - 1;

        //Rotation
        let vecLine = vec2.fromValues(this.pts[nextPoint].x - this.pts[previousPoint].x, this.pts[nextPoint].z - this.pts[previousPoint].z);
        let rotation =  Math.atan2(this.forward[1], this.forward[0]) - Math.atan2(vecLine[1], vecLine[0]);

        //console.log("===================");
        //console.log("Scalled time: " + scaledT);
        //console.log("Previous point: " + previousPoint);
        //console.log("Next point: " + nextPoint);

        //Vector from previous to next
        let vec = {
            x: this.pts[nextPoint].x - this.pts[previousPoint].x,
            y: this.pts[nextPoint].y - this.pts[previousPoint].y,
            z: this.pts[nextPoint].z - this.pts[previousPoint].z
        }

        //Magnitude
        let mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);

        //If magnitude is 0 what to do?
        //Just use magnitude 1 for simplicity, still shouldn't happen
        if (mag == 0)
            mag = 1;

        //Normalize
        vec.x /= mag;
        vec.y /= mag;
        vec.z /= mag;

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
        let pos = vec3.fromValues(this.pts[previousPoint].x + vec.x, this.pts[previousPoint].y + vec.y, this.pts[previousPoint].z + vec.z);

        //Reset matrix
        mat4.identity(this.transformationMat);

        //Apply to matrix;    
        mat4.translate(this.transformationMat, this.transformationMat, pos);
        mat4.rotate(this.transformationMat, this.transformationMat, rotation, vec3.fromValues(0, 1, 0));

    }

}