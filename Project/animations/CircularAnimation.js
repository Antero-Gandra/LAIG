
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
        this.angleI *= convertAngle;
        this.angleRot *= convertAngle;

        //Hardcoded front in direction of positive Z axis
        this.forward = vec2.fromValues(0, 1);

    }

    update(scaledTime) {

        //Delta Angle
        let deltaAngle = scaledTime * this.angleRot / this.span;

        //Final angle
        let angle = this.angleI + deltaAngle;

        //Positions
        let x = Math.cos(angle) * this.radius + this.center.x;
        let y = Math.sin(angle) * this.radius + this.center.z;

        //Vector to point
        let vec = vec3.fromValues(x - this.center.x, y - this.center.z);

        //Perpendicular
        let tmp = vec.x;
        vec.x = vec.y;
        vec.y = -tmp;

        //Rotation
        let rotation = Math.atan2(this.forward[1], this.forward[0]) - Math.atan2(vec[1], vec[0]);
        rotation -= Math.PI / 2;

        //Face forward in inverse rotations
        if (this.angleRot < 0) {
            rotation += Math.PI;
        }

        //Reset Matrix
        mat4.identity(this.transformationMat);

        //Apply to matrix
        let v = vec3.fromValues(x, this.center.y, y);
        mat4.translate(this.transformationMat, this.transformationMat, v);
        mat4.rotate(this.transformationMat, this.transformationMat, rotation, vec3.fromValues(0, 1, 0));

    }

}