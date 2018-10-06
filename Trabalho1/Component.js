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

        this.setup();
    }

    /**
     * Setup everything
     */
    setup() {

        //TODO Setup texture and materials

        //TODO Setup transformation
        //Detect if transformations was explicitly declared or is a reference to the transformations array
        if (Array.isArray(this.transformations)) {

        }

        //Setup primitive nodes
        this.childrenPrimitives = [];
        for (let i = 0; i < this.scene.graph.primitives.length; i++) {
            for (let j = 0; j < this.childrenPrimitivesIDs.length; j++) {
                if (this.scene.graph.primitives[i].id == this.childrenPrimitivesIDs[j]) {
                    this.childrenPrimitives.push(this.scene.graph.primitives[i].shape);
                    break;
                }
            }
        }

        //Setup component nodes
        this.childrenComponents = [];
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

        //TODO apply transformations

        //Draw primitives
        for (let i = 0; i < this.childrenPrimitives.length; i++) {
            this.childrenPrimitives[i].display();
        }

        //Tell children nodes to draw
        for (let i = 0; i < this.childrenComponents.length; i++) {
            this.childrenComponents[i].display();
        }

    }

}