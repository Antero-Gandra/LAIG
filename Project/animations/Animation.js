
class Animation {
    /**
     * @constructor
     */
    constructor(scene) {
        this.scene = scene;
        this.transformationMat = mat4.create();
        mat4.identity(this.transformationMat);
        this.time = 0;
    }

    apply(){
        this.scene.multMatrix(this.transformationMat);
    }

}