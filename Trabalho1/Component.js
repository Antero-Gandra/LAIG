class Component {
    /**
     * @constructor
     */
    constructor(scene, id, transformations_list, materials, texture, childrenComponentsIDs, childrenPrimitivesIDs) {
        this.scene = scene;
        this.id = id;
        this.transformations_list = transformations_list;
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

        //Setup primitive nodes
        for (let i = 0; i < scene.graph.primitives.length; i++) {
            for (let j = 0; j < childrenPrimitivesIDs.length; j++) {
                if (scene.graph.primitives[i] == childrenPrimitivesIDs[j]) {
                    this.childrenPrimitives.push(scene.graph.primitives[i]);
                    break;
                }
            }
        }

        //Setup component nodes
        for (let i = 0; i < scene.graph.components.length; i++) {
            for (let j = 0; j < childrenComponentsIDs.length; j++) {
                if (scene.graph.components[i] == childrenComponentsIDs[j]) {
                    this.childrenComponents.push(scene.graph.components[i]);
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
        for (let i = 0; i < childrenPrimitives.length; i++) {
            childrenPrimitives[i].display();
        }

        //Tell children nodes to draw
        for (let i = 0; i < childrenComponents.length; i++) {
            childrenComponents[i].display();
        }

    }

}