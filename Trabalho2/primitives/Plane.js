
class Plane extends CGFobject {

    constructor(scene, divX, divY) {
        super(scene);
        this.scene = scene;

        //Linear Surface
        var surf = new CGFnurbsSurface(1, 1,
            [
                [
                    [-1, -1, 0, 1],
                    [-1, 1, 0, 1]
                ],
                [
                    [1, -1, 0, 1],
                    [1, 1, 0, 1]
                ]
            ]);

        //Object
        this.obj = new CGFnurbsObject(this.scene, divX, divY, surf);

    };

    display() {
        this.obj.display();
    }

}