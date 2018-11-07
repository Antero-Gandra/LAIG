

class CiruclarAnimation extends Animation {

    /**
     * @constructor
     */
    constructor(scene, center, radius, angleI, angleRot, time) {
        super(scene);
        this.scene = scene;

        this.center = center;
        this.radius = radius;
        this.angleI = angleI;
        this.angleRot = angleRot;
        this.time = time;
    }

    update(){
        
    }

}