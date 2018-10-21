
class Rectangle extends CGFobject {
    constructor(scene, minX, minY, maxX, maxY) {
        super(scene);

        this.minS = 0;
        this.maxS = 1;
        this.minT = 0;
        this.maxT = 1;

        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;

        this.initBuffers();
    };

    initBuffers() {

        this.texCoords = [
            this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT
        ];

        this.initialTexCoords = this.texCoords.slice();

        this.vertices = [
            this.minX, this.minY, 0,
            this.maxX, this.minY, 0,
            this.minX, this.maxY, 0,
            this.maxX, this.maxY, 0
        ];

        this.indices = [
            0, 1, 2,
            3, 2, 1
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ]

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

};