attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

uniform float factor;
uniform sampler2D heightmap;

void main() {
	
	vTextureCoord = aTextureCoord;

	//Heightmap color
	vec4 heightcolor = texture2D(heightmap, aTextureCoord);

	//Normal offset
	vec3 offset=vec3(0,0,0);
    offset = aVertexNormal * factor * heightcolor.r;

	//Final position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}