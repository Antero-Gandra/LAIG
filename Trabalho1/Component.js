
var DEGREE_TO_RAD = Math.PI / 180;

class Component {
    /**
     * @constructor
     */
    constructor(scene, id, transformations, materials, texture, childrenComponentsIDs, childrenPrimitivesIDs) {
        this.scene = scene;
        this.id = id;
        this.transformations = transformations;
        this.materials = materials;
        this.texture = texture;
        this.childrenComponentsIDs = childrenComponentsIDs;
        this.childrenPrimitivesIDs = childrenPrimitivesIDs;

        this.currentMaterial = 0;

        this.childrenPrimitives = [];
        this.childrenComponents = [];
    }

    /**
     * Setup everything
     */
    setup() {

        //Setup materials
        this.appearences = [];
        for (let i = 0; i < this.materials.length; i++) {
            //Add inherit
            if (this.materials[i] == "inherit")
                this.appearences.push({ id: "inherit" });
            //Add custom appearence
            for (let j = 0; j < this.scene.graph.materials.length; j++) {
                const m = this.scene.graph.materials[j];
                if (this.materials[i] == m.id) {
                    var a = { id: "", appearence: null };
                    a.id = m.id;
                    a.appearence = new CGFappearance(this.scene);
                    a.appearence.setShininess(m.shininess);
                    a.appearence.setEmission(m.emission.r, m.emission.g, m.emission.b, m.emission.a);
                    a.appearence.setAmbient(m.ambient.r, m.ambient.g, m.ambient.b, m.ambient.a);
                    a.appearence.setDiffuse(m.diffuse.r, m.diffuse.g, m.diffuse.b, m.diffuse.a);
                    a.appearence.setSpecular(m.specular.r, m.specular.g, m.specular.b, m.specular.a);

                    this.appearences.push(a);
                }
            }
        }

        //Detect if transformations was reference to the transformations array and find it
        if (!Array.isArray(this.transformations)) {
            let id = this.transformations;
            for (let i = 0; i < this.scene.graph.transformations.length; i++) {
                if (id == this.scene.graph.transformations[i].id) {
                    this.transformations = this.scene.graph.transformations[i];
                    break;
                }
            }
        }
        //If it was a list just format it
        else {
            this.transformations = { list: this.transformations };
        }

        //Setup primitive nodes
        for (let i = 0; i < this.scene.graph.primitives.length; i++) {
            for (let j = 0; j < this.childrenPrimitivesIDs.length; j++) {
                if (this.scene.graph.primitives[i].id == this.childrenPrimitivesIDs[j]) {
                    this.childrenPrimitives.push(this.scene.graph.primitives[i].shape);
                    break;
                }
            }
        }

        //Setup component nodes
        for (let i = 0; i < this.scene.graph.components.length; i++) {
            for (let j = 0; j < this.childrenComponentsIDs.length; j++) {
                if (this.scene.graph.components[i].id == this.childrenComponentsIDs[j]) {
                    this.childrenComponents.push(this.scene.graph.components[i]);
                    break;
                }
            }
        }

        //Setup matrix
        this.transformationMat = mat4.create();
        mat4.identity(this.transformationMat);

        for (let t = 0; t < this.transformations.list.length; t++) {
            switch (this.transformations.list[t].type) {
                case "translate":
                    mat4.translate(this.transformationMat, this.transformationMat, [this.transformations.list[t].x, this.transformations.list[t].y, this.transformations.list[t].z]);
                    break;
                case "rotate":
                    switch (this.transformations.list[t].axis) {
                        case "x":
                            mat4.rotate(this.transformationMat, this.transformationMat, this.transformations.list[t].angle * DEGREE_TO_RAD, [1, 0, 0]);
                            break;
                        case "y":
                            mat4.rotate(this.transformationMat, this.transformationMat, this.transformations.list[t].angle * DEGREE_TO_RAD, [0, 1, 0]);
                            break;
                        case "z":
                            mat4.rotate(this.transformationMat, this.transformationMat, this.transformations.list[t].angle * DEGREE_TO_RAD, [0, 0, 1]);
                            break;
                        default:
                            break;
                    }
                    break;
                case "scale":
                    mat4.scale(this.transformationMat, this.transformationMat, [this.transformations.list[t].x, this.transformations.list[t].y, this.transformations.list[t].z]);
                    break;
                default:
                    break;
            }
        }

    }

    /**
     * Displays children primitives and tells children components to do the same
     */
    display(callerMaterial) {

        //Get previous texture
        var tmpTex = null;
        if (this.texture.id == "inherit")
            tmpTex = this.scene.activeTexture;

        //Apply materials
        var materialToPass;
        if (this.appearences[this.currentMaterial].id == "inherit") {
            if (callerMaterial == null) {
                var a = {
                    appearence: new CGFappearance(this.scene)
                }
                a.appearence.apply();
                materialToPass = a;
            } else {
                callerMaterial.appearence.apply();
                materialToPass = callerMaterial;
            }
        } else {
            this.appearences[this.currentMaterial].appearence.apply();
            materialToPass = this.appearences[this.currentMaterial];
        }

        //Apply texture
        if (this.texture.id != "none") {
            //Use new texture
            if (tmpTex == null) {
                for (let i = 0; i < this.scene.graph.loadedTextures.length; i++) {
                    if (this.scene.graph.loadedTextures[i].id == this.texture.id) {
                        if (this.scene.graph.loadedTextures[i].tex.bind()) {
                            this.scene.activeTexture = this.scene.graph.loadedTextures[i].tex;
                        }
                    }
                }
                //Update texture coordinates from own
                for (let p = 0; p < this.childrenPrimitives.length; p++) {
                    this.updateTexCoords(this.childrenPrimitives[p], this.texture.length_s, this.texture.length_t);
                }
            }
            //Use inherited(previous texture)
            else {
                //Set texture
                if (tmpTex.bind()) {
                    this.scene.activeTexture = tmpTex;
                }
                //Update texture coordinates from father
                if (this.texture.length_s == null) {
                    for (let p = 0; p < this.childrenPrimitives.length; p++) {
                        this.updateTexCoords(this.childrenPrimitives[p]);
                    }
                }
                //Update texture coordinates from own
                else {
                    for (let p = 0; p < this.childrenPrimitives.length; p++) {
                        this.updateTexCoords(this.childrenPrimitives[p], this.texture.length_s, this.texture.length_t);
                    }
                }
            }
        }

        //Apply transformations
        this.scene.multMatrix(this.transformationMat);

        //Draw primitives     
        for (let i = 0; i < this.childrenPrimitives.length; i++)
            this.childrenPrimitives[i].display();

        //Tell children nodes to draw
        for (let i = 0; i < this.childrenComponents.length; i++) {
            this.scene.pushMatrix();
            this.childrenComponents[i].display(materialToPass);
            this.scene.popMatrix();
        }

    }

    //Selects next material
    nextMaterial() {

        this.currentMaterial++;
        if (this.currentMaterial >= this.materials.length)
            this.currentMaterial = 0;

    }

    //Update Texture Coordinates
    updateTexCoords(primitive, length_s = this.texture.length_s, length_t = this.texture.length_t) {

        if (primitive.initialTexCoords != undefined) {
            for (let i = 0; i < primitive.initialTexCoords.length; i += 2) {
                primitive.texCoords[i] = primitive.initialTexCoords[i] / length_s;
                primitive.texCoords[i + 1] = primitive.initialTexCoords[i + 1] / length_t;
            }
        } 
        //Cylinder has multiple primitives
        else {
            if (primitive.coreCylinder != undefined) {
                for (let i = 0; i < primitive.coreCylinder.initialTexCoords.length; i += 2) {
                    primitive.coreCylinder.texCoords[i] = primitive.coreCylinder.initialTexCoords[i] / length_s;
                    primitive.coreCylinder.texCoords[i + 1] = primitive.coreCylinder.initialTexCoords[i + 1] / length_t;
                }
            }
            if (primitive.baseCircle != undefined) {
                for (let i = 0; i < primitive.baseCircle.initialTexCoords.length; i += 2) {
                    primitive.baseCircle.texCoords[i] = primitive.baseCircle.initialTexCoords[i] / length_s;
                    primitive.baseCircle.texCoords[i + 1] = primitive.baseCircle.initialTexCoords[i + 1] / length_t;
                }
            }
            if (primitive.topCirlce != undefined) {
                for (let i = 0; i < primitive.topCirlce.initialTexCoords.length; i += 2) {
                    primitive.topCirlce.texCoords[i] = primitive.topCirlce.initialTexCoords[i] / length_s;
                    primitive.topCirlce.texCoords[i + 1] = primitive.topCirlce.initialTexCoords[i + 1] / length_t;
                }
            }
        }

        primitive.updateTexCoordsGLBuffers();

    }

}