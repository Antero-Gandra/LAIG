
class Patch extends CGFobject {

    constructor(scene, degree1, degree2, control, divX, divY) {
        super(scene);
        this.scene = scene;

        //Surface
        var surf = new CGFnurbsSurface(degree1, degree2, control);

        //Object
        this.obj = new CGFnurbsObject(this.scene, divX, divY, surf);

    };

}