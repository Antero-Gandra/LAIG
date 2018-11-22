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

	vec3 tmp = vec3(aVertexPosition);
	
	tmp += aVertexNormal * normScale;

	vec4 vertex = uMVMatrix * vec4(tmp, 1.0);

	gl_Position = uPMatrix * vertex;

}
