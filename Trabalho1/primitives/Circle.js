
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

        this.initialTexCoords = this.texCoords;

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        
    };

    //TODO function to update texCoords if needed

};