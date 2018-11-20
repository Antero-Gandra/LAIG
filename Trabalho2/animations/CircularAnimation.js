

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
        this.span = span;
    }

    update(time){
        
    }

}