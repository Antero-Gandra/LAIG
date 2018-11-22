#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;

void main() {
	gl_FragColor = coords;
}