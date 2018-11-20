
class Plane extends CGFobject {

    constructor(scene, divX, divY) {
        super(scene);

        //Linear
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
            ])

        //Object
        this.obj = new CGFnurbsObject(this, divX, divY, surf);

    };

}