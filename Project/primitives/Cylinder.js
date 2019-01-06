
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

        this.scene.pushMatrix();

        this.scene.rotate(Math.PI, 0, 1, 0);

        //Core Cylinder
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.coreCylinder.display();
        this.scene.popMatrix();

        //Draw base
        this.scene.pushMatrix();
        this.scene.scale(this.base, this.base, 1);
        this.baseCircle.display();
        this.scene.popMatrix();

        //Draw top
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.height);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.scale(this.top, this.top, 1);
        this.topCirlce.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

};

class Circle extends CGFobject {
    constructor(scene, slices = 6) {
        super(scene);
        this.slices = slices;

        this.initBuffers();
    };

    initBuffers() {

        var i;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 2 * Math.PI / this.slices;
        var i, j, x, y;
        var n_vertices = 0;

        for (j = 0; j < this.slices; j++) {
            x = Math.cos(j * ang);
            y = Math.sin(j * ang);

            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, 1);
            this.texCoords.push(x / 2 + 0.5, - y / 2 + 0.5);
            n_vertices++;
        }

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);
        this.initialTexCoords = this.texCoords.slice();
        n_vertices++;

        for (i = 0; i < n_vertices - 1; i++) {
            this.indices.push(n_vertices - 1);

            if (i == this.slices - 1)
                this.indices.push(0);
            else
                this.indices.push(i + 1);

            this.indices.push(i);
        }

        for (i = 0; i < n_vertices - 1; i++) {
            this.indices.push(n_vertices - 1);

            this.indices.push(i);

            if (i == this.slices - 1)
                this.indices.push(0);
            else
                this.indices.push(i + 1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();

    };

};

class CoreCylinder extends CGFobject {
    constructor(scene, base, top, height, slices = 6, stacks = 1) {
        super(scene);

        this.slices = parseInt(slices);
        this.stacks = parseInt(stacks);
        this.base = base;
        this.top = top;
        this.height = height;
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

        var patchLengthx = 1 / this.slices;
        var patchLengthy = 1 / this.stacks;
        var xCoord = 0;
        var yCoord = 0;

        for (var q = 0; q < this.stacks + 1; q++) {

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

        this.initialTexCoords = this.texCoords.slice();

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

};