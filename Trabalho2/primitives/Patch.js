
class Patch extends CGFobject {

    constructor(scene, degree1, degree2, control, divX, divY) {
        super(scene);

        //Linear
        var surf = new CGFnurbsSurface(degree1, degree2, control);

        //Object
        this.obj = new CGFnurbsObject(this, divX, divY, surf);

    };

}