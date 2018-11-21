

class CiruclarAnimation extends Animation {

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
        this.span = span; // rotation time
    }

    update(time){
        
        //Scale time
        let scale = time % this.span;

        //Delta Angle
       let deltaAngle = scale * this.angleRot / this.span;
    
        //Positions
        let x = Math.cos(this.angleI + deltaAngle) * this.radius;
        let y = Math.sin(this.angleI + deltaAngle) * this.radius;
         
        


        
        translate







        


            

    }

}