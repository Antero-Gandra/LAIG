
class Animation {
    /**
     * @constructor
     */
    constructor(scene) {
        this.scene = scene;
        this.transformationMat = mat4.create();
        this.time = 0;
    }

    apply(){
        this.scene.multMatrix(this.transformationMat)
    }

}