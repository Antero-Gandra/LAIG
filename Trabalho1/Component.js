
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

        this.childrenPrimitives = [];
        this.childrenComponents = [];
    }

    /**
     * Setup everything
     */
    setup() {

        //TODO Setup texture and materials

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

    }

    /**
     * Displays children primitives and tells children components to do the same
     */
    display() {

        //TODO Apply materials/texture

        //Apply transformations
        for (let t = 0; t < this.transformations.list.length; t++) {
            switch (this.transformations.list[t].type) {
                case "translate":
                    this.scene.translate(this.transformations.list[t].x, this.transformations.list[t].y, this.transformations.list[t].z);
                    break;
                case "rotate":
                    switch (this.transformations.list[t].axis) {
                        case "x":
                            this.scene.rotate(this.transformations.list[t].angle * DEGREE_TO_RAD, 1, 0, 0);
                            break;
                        case "y":
                            this.scene.rotate(this.transformations.list[t].angle * DEGREE_TO_RAD, 0, 1, 0);
                            break;
                        case "z":
                            this.scene.rotate(this.transformations.list[t].angle * DEGREE_TO_RAD, 0, 0, 1);
                            break;
                        default:
                            break;
                    }
                    break;
                case "scale":
                    this.scene.scale(this.transformations.list[t].x, this.transformations.list[t].y, this.transformations.list[t].z);
                    break;
                default:
                    break;
            }
        }

        //Draw primitives
        for (let i = 0; i < this.childrenPrimitives.length; i++)
            this.childrenPrimitives[i].display();

        //Tell children nodes to draw
        for (let i = 0; i < this.childrenComponents.length; i++)
            this.childrenComponents[i].display();

    }

}