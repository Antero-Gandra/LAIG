
class Torus extends CGFobject {
    constructor(scene, inner, outter, slices = 20, loops = 20) {
        super(scene);

        this.r = (outter - inner) / 2;
        this.R = inner + this.r;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

    initBuffers() {

        this.vertices = new Array();
        this.indices = new Array();
        this.normals = new Array();
        this.texCoords = new Array();

        var ang_circle = (2 * Math.PI) / this.slices;
        var ang_between_circles = (2 * Math.PI) / this.loops;
        var texS = 1 / this.loops;
        var texT = 1 / this.slices;

        for (var i = 0; i <= this.loops; i++) {
            for (var j = 0; j <= this.slices; j++) {
                var v = i * ang_between_circles;//theta
                var u = j * ang_circle;//phi

                var x = (this.R + this.r * Math.cos(v)) * Math.cos(u);
                var y = (this.R + this.r * Math.cos(v)) * Math.sin(u);
                var z = this.r * Math.sin(v);

                var s = 1 - i * texS;
                var t = 1 - j * texT;

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);

                this.texCoords.push(s, t);
            }
        }

        this.initialTexCoords = this.texCoords.slice();

        for (var i = 0; i < this.loops; i++) {
            for (var j = 0; j < this.slices; j++) {
                var first = i * (this.slices + 1) + j;
                var second = first + this.slices;

                this.indices.push(first, second + 2, second + 1);
                this.indices.push(first, first + 1, second + 2);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    //TODO function to update texCoords if needed

};