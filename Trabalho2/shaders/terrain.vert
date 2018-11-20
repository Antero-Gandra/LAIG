#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute float aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float normScale;
varying vec4 coords;
varying vec4 normal;


void main() {
	vec4 vertex = aVertexPosition;
	vertex.y + aVertexNormal * normScale;

	gl_Position = uPMatrix * uMVMatrix * vertex;

	normal = vec4(aVertexNormal, 1.0);

	coords=vertex/10.0;
}
