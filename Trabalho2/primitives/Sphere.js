
class Sphere extends CGFobject {
    constructor(scene, radius, slices = 20, stacks = 20) {
        super(scene);

        this.radius = radius;
        this.semisphere = new Semisphere(scene, slices, stacks);

        this.initBuffers();
    };

    display() {
        //Side1
        this.scene.pushMatrix();
        this.scene.scale(this.radius, this.radius, this.radius);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.semisphere.display();
        this.scene.popMatrix();

        //Side2
        this.scene.pushMatrix();
        this.scene.scale(this.radius, this.radius, this.radius);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.semisphere.display();
        this.scene.popMatrix();
    }

    //TODO function to update texCoords if needed

};

class Semisphere extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.Tinc = 1 / stacks;
        this.Sinc = 1 / slices;
        this.initBuffers();
    };

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 2 * Math.PI / this.slices;
        var vert = 2 * Math.PI / (this.stacks);

        for (var i = 0; i <= this.stacks; i++) {
            for (var m = 0; m < this.slices; m++) {
                this.vertices.push(Math.cos(ang * m) * Math.sin(Math.PI / 2 - vert * i),
                    Math.sin(ang * m) * Math.sin(Math.PI / 2 - vert * i), Math.sin(vert * i));
                this.normals.push(Math.cos(ang * m) * Math.sin(Math.PI / 2 - vert * i),
                    Math.sin(ang * m) * Math.sin(Math.PI / 2 - vert * i), Math.sin(vert * i));
            }
        }

        for (var j = 0; j < this.stacks; j++) {
            for (var i = 0; i < (this.slices); i += 1) {
                this.indices.push((i + 1) % (this.slices) + j * this.slices,
                    i % (this.slices) + (j + 1) * this.slices,
                    i % (this.slices) + j * this.slices);

                this.indices.push(i % (this.slices) + (j + 1) * this.slices,
                    (i + 1) % (this.slices) + j * this.slices,
                    (i + 1) % (this.slices) + (j + 1) * this.slices);
            }
        }

        var s = 0;
        var t = 1;

        for (var i = 0; i <= this.stacks; i++) {
            for (var m = 0; m < this.slices; m++) {
                this.texCoords.push(s, t);
                s += this.Sinc;
            }
            s = 0;
            t -= this.Tinc;
        }

        this.initialTexCoords = this.texCoords.slice();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

}