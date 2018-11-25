
const convertAngle = Math.PI / 180

class CircularAnimation extends Animation {

    /**
     * @constructor
     */
    constructor(scene, center, radius, angleI, angleRot, span) {
        super(scene);
        this.scene = scene;
        this.center = center;
        this.radius = radius;
        this.angleI = angleI;
        this.angleRot = angleRot;
        this.span = span;

        //Convert to Radians
        this.angleI = this.angleI * convertAngle;
        this.angleRot = this.angleRot * convertAngle;

    }

    update(time) {
        //Scale time
        let scale = time % this.span;

        //Delta Angle
        let deltaAngle = scale * this.angleRot / this.span;

        //Final angle
        let angle = this.angleI + deltaAngle;

        //Positions
        let x = Math.cos(angle) * this.radius + this.center.x;
        let z = Math.sin(angle) * this.radius + this.center.y;

        //Reset Matrix
        mat4.identity(this.transformationMat);
        //Apply to matrix
        let t = vec3.fromValues(x, 0, z);
        mat4.translate(this.transformationMat, this.transformationMat, t);

    }

}