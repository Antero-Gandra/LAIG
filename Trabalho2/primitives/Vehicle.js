
class Vehicle extends CGFobject {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.center = new Cylinder2(this.scene, 2, 0, 3, 20, 20);
        this.back = new Circle(this.scene,20);

        //Wing upper side
        this.wingSurfaceUp = new CGFnurbsSurface(4,1,
            [
                [
                    [3, -.2, 0, 1],
                    [3, 1, 0, 1]
                ],
                [
                    [1, -1, -.5, 1],
                    [1, 1, -.5, 1]
                ],
                [
                    [0, -1, -.5, 1],
                    [0, 1, -.5, 1]
                ],
                [
                    [-1, -1, -.5, 1],
                    [-1, 1, -.5, 1]
                ],
                [
                    [-3, -.2, 0, 1],
                    [-3, 1, 0, 1]
                ]
            ]);
        this.wingObjUp = new CGFnurbsObject(this.scene, 20, 20, this.wingSurfaceUp);

        //Wing lower side (like upper but order of points reversed)
        this.wingSurfaceDown = new CGFnurbsSurface(4,1,
            [
                [
                    [-3, -.2, 0, 1],
                    [-3, 1, 0, 1]
                ],
                [
                    [-1, -1, -.5, 1],
                    [-1, 1, -.5, 1]
                ],
                [
                    [0, -1, -.5, 1],
                    [0, 1, -.5, 1]
                ],
                [
                    [1, -1, -.5, 1],
                    [1, 1, -.5, 1]
                ],
                [
                    [3, -.2, 0, 1],
                    [3, 1, 0, 1]
                ]
            ]);
        this.wingObjDown = new CGFnurbsObject(this.scene, 20, 20, this.wingSurfaceDown);
        

    };

    display() {

        this.scene.pushMatrix();

            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.scene.scale(1,1,.4);
            
            this.center.display();

            this.scene.pushMatrix();       
                this.scene.rotate(Math.PI, 1, 0,0);     
                this.wingObjUp.display();
                this.wingObjDown.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, -3, 0);
                this.scene.rotate(Math.PI/2, 1, 0,0);
                this.scene.scale(2.05, 2.05, 1);
                this.back.display();
            this.scene.popMatrix();

        this.scene.popMatrix();
    }

}