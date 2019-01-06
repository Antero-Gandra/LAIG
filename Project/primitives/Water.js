
class Water extends Plane {

    constructor(scene, idtexture, idheightmap, parts, heightscale, texscale) {
        super(scene, parts, parts);
        this.scene = scene;
        this.idtexture = idtexture;
        this.idheightmap = idheightmap;
        this.heightscale = heightscale;

        this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/texture.frag");

        //Textures binded to 1 and 2
        this.shader.setUniformsValues({ colormap: 1, heightmap: 2, factor: this.heightscale });

        //Setup material
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);

        //Setup tex coordinates
        for (let i = 0; i < this.obj.texCoords.length; i += 2) {
            this.obj.texCoords[i] = this.obj.texCoords[i] / texscale;
            this.obj.texCoords[i + 1] = this.obj.texCoords[i + 1] / texscale;
        }
        this.obj.updateTexCoordsGLBuffers();

    };

    display(elapsedTime) {

        //Check if loaded yet
        if (this.waterTex == undefined || this.heightTex == undefined) {
            //Search textures
            for (let i = 0; i < this.scene.graph.loadedTextures.length; i++) {
                if (this.scene.graph.loadedTextures[i].id == this.idtexture) {
                    this.waterTex = this.scene.graph.loadedTextures[i].tex;
                }
                if (this.scene.graph.loadedTextures[i].id == this.idheightmap) {
                    this.heightTex = this.scene.graph.loadedTextures[i].tex;
                }
            }

            //Set texture
            this.appearance.setTexture(this.waterTex);
            this.appearance.setTextureWrap('REPEAT', 'REPEAT');

            //Set size
            this.shader.setUniformsValues({ size: this.waterTex.image.width });
        } else {
            //Appy material
            this.appearance.apply();

            //Pass time to shader
            this.shader.setUniformsValues({ delta: elapsedTime / 30 });

            //Activate shader
            this.scene.setActiveShader(this.shader);

            this.scene.pushMatrix();

            //Bind textures
            this.waterTex.bind(1);
            this.heightTex.bind(2);

            super.display();

            this.scene.popMatrix();

            //Reset to default shader
            this.scene.setActiveShader(this.scene.defaultShader);
        }

    }

}