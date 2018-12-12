
class Terrain extends Plane {

    constructor(scene, idtexture, idheightmap, parts, heightscale) {
        super(scene, parts, parts);
        this.scene = scene;
        this.idtexture = idtexture;
        this.idheightmap = idheightmap;
        this.heightscale = heightscale;

        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/texture.frag");

        //Textures binded to 2 and 3
        this.shader.setUniformsValues({ colormap: 1, heightmap: 2, factor: this.heightscale });

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);

    };

    display() {

        //Check if loaded yet
        if (this.terrainTex == undefined || this.heightTex == undefined) {
            //Search textures
            for (let i = 0; i < this.scene.graph.loadedTextures.length; i++) {
                if (this.scene.graph.loadedTextures[i].id == this.idtexture) {
                    this.terrainTex = this.scene.graph.loadedTextures[i].tex;
                }
                if (this.scene.graph.loadedTextures[i].id == this.idheightmap) {
                    this.heightTex = this.scene.graph.loadedTextures[i].tex;
                }
            }
            //Set texture
            this.appearance.setTexture(this.terrainTex);
	        this.appearance.setTextureWrap ('REPEAT', 'REPEAT');
        } else {
            //Appy material
            this.appearance.apply();

            //Activate shader
            this.scene.setActiveShader(this.shader);

            this.scene.pushMatrix();
            
            //Bind textures
            this.terrainTex.bind(1);
            this.heightTex.bind(2);

            super.display();

            this.scene.popMatrix();

            //Reset to default shader
            this.scene.setActiveShader(this.scene.defaultShader);
        }

    }

}