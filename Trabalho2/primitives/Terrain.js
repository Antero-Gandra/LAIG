
class Terrain extends Plane {

    constructor(scene, idtexture, idheightmap, parts, heightscale) {
        super(scene, parts, parts);
        this.scene = scene;

        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        
    };

    display() {
        this.scene.setActiveShader(this.shader);
        super.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

}