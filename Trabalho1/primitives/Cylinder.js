
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
                this.scene.translate(0,0,-this.height);
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.scene.scale(this.top, this.top, 1);
                this.topCirlce.display();
            this.scene.popMatrix();

        this.scene.popMatrix();
    }

};

class Circle extends CGFobject {
    constructor(scene, slices = 6, size) {
        super(scene);

        this.minS = 0;
        this.maxS = 1;
        this.minT = 0;
        this.maxT = 1;

        this.slices = slices;
        this.size = size;

        this.initBuffers();
    };

    initBuffers() {

        this.vertices = new Array();
        this.indices = new Array();
        this.normals = new Array();
        this.texCoords = new Array();
        this.initialTexCoords = new Array();

        var ang = Math.PI * 2 / this.slices;

        var count = 0;

        for (var i = 0; i < this.slices; i++) {
            this.vertices.push(Math.cos(ang * i), Math.sin(ang * i), 0);
            this.texCoords.push(-.5 * Math.cos((i) * ang) + .5, .5 * Math.sin((i) * ang) + .5);
            this.texCoords.push(-.5 * Math.cos((i + 1) * ang) + .5, .5 * Math.sin((i + 1) * ang) + .5);
            count++;
        }

        for (var i = 0; i < this.slices; i++)
            this.normals.push(0, 0, 1);

        this.vertices.push(0, 0, 0);

        var i = 1;
        for (; i < this.slices - 1; i++)
            this.indices.push(count - 1, i - 1, i);

        this.indices.push(0, i - 1, count - 1);

        this.initialTexCoords = this.texCoords.slice();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    };

    //TODO function to update texCoords if needed

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