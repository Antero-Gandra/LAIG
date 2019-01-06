
class Cylinder2 extends CGFobject {

    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.surface = new CGFnurbsSurface(5, 1, [
            [
                [-base, -height, 0, 1],
                [-top, height, 0, 1]

            ],
            [
                [-base, -height, base, 1],
                [-top, height, top, 1]
            ],
            [
                [0, -height, base + base / 2, 1],
                [0, height, top + top / 2, 1]
            ],
            [
                [base, -height, base, 1],
                [top, height, top, 1]
            ],
            [
                [base, -height, 0, 1],
                [top, height, 0, 1]
            ],
            [
                [base, -height, 0, 1],
                [top, height, 0, 1]
            ],

        ]);
        this.half = new CGFnurbsObject(scene, slices, stacks, this.surface);
        this.scene = scene;

    };

    display() {

        this.half.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0)
        this.half.display();
        this.scene.popMatrix();

    }

}