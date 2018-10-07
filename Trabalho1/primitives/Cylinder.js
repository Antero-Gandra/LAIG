
class Cylinder extends CGFobject {

    constructor(scene, base, top, height, slices = 6, stacks = 1) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;

        this.coreCylinder = new CoreCylinder(scene, base, top, height, slices, stacks);

        this.baseCircle = new Circle(scene, slices, base);
        this.topCirlce = new Circle(scene, slices, top);

        this.initBuffers();
    };

    display() {

        //Core Cylinder
        this.scene.pushMatrix();
        this.coreCylinder.display();
        this.scene.popMatrix();

        //Draw base
        this.scene.pushMatrix();
        this.scene.scale(this.base, this.base, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.baseCircle.display();
        this.scene.popMatrix();

        //Draw top
        this.scene.pushMatrix();
        this.scene.scale(this.top, this.top, 1);
        this.scene.translate(0, 0, this.height);
        this.topCirlce.display();
        this.scene.popMatrix();
    }

    //TODO function to update texCoords if needed

};

class CoreCylinder extends CGFobject {
    constructor(scene, base, top, height, slices = 6, stacks = 1) {
        super(scene);

        this.slices = parseInt(slices);
        this.stacks = parseInt(stacks);
        this.base = parseInt(base);
        this.top = parseInt(top);
        this.height = parseInt(height);
        this.deltaHeight = this.height / this.stacks;
        this.delta = (this.top - this.base) / this.stacks;

        this.initBuffers();
    };

    initBuffers() {

        var n = -2 * Math.PI / this.slices;

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];
        this.initialTexCoords = [];

        var patchLengthx = 1 / this.slices;
        var patchLengthy = 1 / this.stacks;
        var xCoord = 0;
        var yCoord = 0;

        for (var q = 0; q < this.stacks + 1; q++) {

            var z = (q * this.deltaHeight / this.stacks);
            var inc = (q * this.delta) + this.base;

            for (var i = 0; i < this.slices; i++) {
                this.vertices.push(inc * Math.cos(i * n), inc * Math.sin(i * n), q * this.deltaHeight);
                this.normals.push(Math.cos(i * n), Math.sin(i * n), 0);
                this.texCoords.push(xCoord, yCoord);
                xCoord += patchLengthx;
            }
            xCoord = 0;
            yCoord += patchLengthy;

        }

        for (var q = 0; q < this.stacks; q++) {
            for (var i = 0; i < this.slices; i++) {
                this.indices.push(this.slices * q + i, this.slices * q + i + 1, this.slices * (q + 1) + i);
                this.indices.push(this.slices * q + i + 1, this.slices * q + i, this.slices * (q + 1) + i);
                if (i != (this.slices - 1)) {
                    this.indices.push(this.slices * (q + 1) + i + 1, this.slices * (q + 1) + i, this.slices * q + i + 1);
                    this.indices.push(this.slices * (q + 1) + i, this.slices * (q + 1) + i + 1, this.slices * q + i + 1);
                } else {
                    this.indices.push(this.slices * q, this.slices * q + i + 1, this.slices * q + i);
                    this.indices.push(this.slices * q + i + 1, this.slices * q, this.slices * q + i);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    };

    //TODO function to update texCoords if needed

};