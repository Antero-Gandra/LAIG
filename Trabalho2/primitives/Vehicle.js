
class Vehicle extends CGFobject {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.center = new Cylinder2(this.scene, 2, 0, 3, 20, 20);
        this.back = new Circle(this.scene, 20);

        //Wing upper side
        this.wingSurfaceUp = [
            { x: 3, y: -.2, z: 0 },
            { x: 3, y: 1, z: 0 },
            { x: 1, y: -1, z: -.5 },
            { x: 1, y: 1, z: -.5 },
            { x: 0, y: -1, z: -.5 },
            { x: 0, y: 1, z: -.5 },
            { x: -1, y: -1, z: -.5 },
            { x: -1, y: 1, z: -.5 },
            { x: -3, y: -.2, z: 0 },
            { x: -3, y: 1, z: 0 }
        ];

        this.wingObjUp = new Patch(this.scene, 5, 2, this.wingSurfaceUp, 20, 20);

        //Wing lower side (like upper but order of points reversed)
        this.wingSurfaceDown = [
            { x: -3, y: -.2, z: 0 },
            { x: -3, y: 1, z: 0 },
            { x: -1, y: -1, z: -.5 },
            { x: -1, y: 1, z: -.5 },
            { x: 0, y: -1, z: -.5 },
            { x: 0, y: 1, z: -.5 },
            { x: 1, y: -1, z: -.5 },
            { x: 1, y: 1, z: -.5 },
            { x: 3, y: -.2, z: 0 },
            { x: 3, y: 1, z: 0 }
        ];

        this.wingObjDown = new Patch(this.scene, 5, 2, this.wingSurfaceDown, 20, 20);


    };

    display() {

        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(1, 1, .4);

        this.center.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.wingObjUp.display();
        this.wingObjDown.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -3, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(2.05, 2.05, 1);
        this.back.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

}