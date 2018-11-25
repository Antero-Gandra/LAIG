class CircularAnimation extends Animation {

    /**
     * @constructor
     */
    constructor(scene, center, radius, angleI, angleRot, span) {
        super(scene);
        this.scene = scene;
        this.center = center;
        this.radius = radius;
        this.angleI = angleI; // Initial Angle 
        this.angleRot = angleRot; // Rotation Angle
        this.span = span; // Rotation time
     
    }

    update(time) {
          //Scale time
        let scale = time % this.span;

        //Delta Angle
        let deltaAngle = scale * this.angleRot / this.span;

        //Angle to Rad 
        let convertAngle = Math.PI / 180;

        //Converting 
        this.angleI = this.angleI * convertAngle;
        this.angleRot = this.angleRot * convertAngle;

        //Final angle
        let angle = this.angleI + deltaAngle;

        //Positions
        let x = Math.cos(angle) * this.radius + this.center;
        let y = Math.sin(angle) * this.radius + this.center;

        //Transfortmations
        //Reset Matrix
        mat4.identity(this.transformationMat);
        //Apply to matrix
        mat4.translate(this.transformationMat, this.transformationMat,vec3.fromValues(x,y,0));

    }

}