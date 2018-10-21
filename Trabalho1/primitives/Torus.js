
class Torus extends CGFobject {
	constructor(scene, inner, outer, slices = 20, loops = 20) {
		super(scene);
		this.inner = outer - inner;
		this.outer = outer + inner;
		this.slices = slices;
		this.loops = loops;

		this.initBuffers();

	};

	initBuffers() {

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var i = 0; i <= this.loops; i++) {

			var theta = i * 2 * Math.PI / this.loops;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for (var j = 0; j <= this.slices; j++) {
				var phi = j * 2 * Math.PI / this.slices;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var r = (this.outer - this.inner) / 2;
				var R = this.inner + r;

				var x = (R + r * cosTheta) * cosPhi;
				var y = (R + r * cosTheta) * sinPhi;
				var z = r * sinTheta;

				var s = 1 - (i / this.loops);
				var t = 1 - (j / this.slices);

				this.vertices.push(x, y, z);
				this.normals.push(x, y, z);
				this.texCoords.push(s, t);
			}
		}

		this.initialTexCoords = this.texCoords.slice();

		for (var i = 0; i < this.loops; i++) {
			for (var j = 0; j < this.slices; j++) {

				var first = (i * (this.slices + 1)) + j;
				var second = first + this.slices + 1;

				this.indices.push(first, second + 1, second);
				this.indices.push(first, first + 1, second + 1);
			}
		}
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

};