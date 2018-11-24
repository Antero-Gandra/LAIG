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

         //Scale time
        let scale = time % this.span;

        //Delta Angle
        let deltaAngle = scale * this.angleRot / this.span;
       
        //Angle to Rad 
        let convertAngle = Math.PI / 180;
       
        //Converting 
        this.angleI= this.angleI * convertAngle;
        this.angleRot = this.angleRot * convertAngle;
       
        //Length
        this.length = Math.abs(this.angleRot) / 360 * (2 * this.radius * Math.PI);
              
        //Duration
        this.duration = this.length / this.scale * 1000;
        
        // // //Positions
        // // let x = Math.cos(this.angleI + deltaAngle) * this.radius;
        // // let y = Math.sin(this.angleI + deltaAngle) * this.radius;

        // //Rotation
        // mat4.fromRotationTranslation();

    }

    update(time){

    if (time > this.duration)
    return null;
    
    let p = time / this.duration;
    
    if (p < 0 || p > 1) 
    throw new Error("Invalid Circular Animation parameter p");
      
    mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, this.center);
    mat4.rotateY(this.matrix, this.matrix, this.angleRot * t);
    mat4.rotateY(this.matrix, this.matrix, this.angleI);
    mat4.translate(this.matrix, this.matrix, [this.radius, 0, 0]);

    }

}