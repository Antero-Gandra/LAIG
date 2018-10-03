// Order of the groups in the XML document.
const SCENE_INDEX = 0;
const VIEWS_INDEX = 1;
const AMBIENT_INDEX = 2;
const LIGHTS_INDEX = 3;
const TEXTURES_INDEX = 4;
const MATERIALS_INDEX = 5;
const TRANSFORMATIONS_INDEX = 6;
const PRIMITIVES_INDEX = 7;
const COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse materials block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Example parser
     */
    parseInitials(initialsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "LIGHT") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            } else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            } else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            } else
                return "ambient component undefined for ID = " + lightId;

            // TODO: Retrieve the diffuse component

            // TODO: Retrieve the specular component

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        //TODO push to this
        this.scene;

        //Root
        var sceneRoot = this.reader.getString(sceneNode, 'root');
        if (sceneRoot == NULL) {
            return "No root defined"
        }

        //Axis
        var sceneAxisLength = this.reader.getFloat(sceneNode, 'axis_length');
        if (sceneAxisLength <= 0) {
            return "Scene axis length should be bigger then 0"
        }

        this.log("Parsed scene");

        return null;
    }

    /**
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {

        //TODO push to these
        this.perspectiveViews = [];
        this.orthoViews = [];

        //Read default ID
        var defaultViewId = this.reader.getString(viewsNode, 'id');

        if(defaultViewId == null)
            return "no default view ID defined";

        //Children
        var children = viewsNode.children;

        for (let i = 0; i < children.length; i++) {
            //Perspective
            if (children[i].nodeName == "perspective") {

                var perspective = {
                    id: "",
                    near: 0,
                    far: 0,
                    angle: 0,
                    from: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    to: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                };

                //Id
                perspective.id = this.reader.getString(children[i], 'id');
                if (perspective.id == null)
                    return "no ID defined for perspective view";

                //Near
                perspective.near = this.reader.getFloat(children[i], 'near');
                if (perspective.near < 0 || perspective.near == null)
                    return "invalid near plane for perspective view";

                //Far
                perspective.far = this.reader.getFloat(children[i], 'far');
                if (perspective.far < 0 || perspective.far == null)
                    return "invalid far plane for perspective view";

                //Children of Perspective
                var grandChildren = children[i].children;

                for (let j = 0; j < grandChildren.length; j++) {

                    var x,y,z
                    
                    //From
                    if(grandChildren[j].nodeName == "from"){
                        //x
                        x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x < 0 || x == null || x > 1 || isNaN(x))
                            return "invalid x value for perspective view from";
                        perspective.far.x = x;
                        //y
                        y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y < 0 || y == null || y > 1 || isNaN(y))
                            return "invalid y value for perspective view from";
                        perspective.far.y = y;
                        //z
                        z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z < 0 || z == null || z > 1 || isNaN(z))
                            return "invalid z value for perspective view from";
                        perspective.far.z = z;
                    }
                    //To
                    else if(grandChildren[j].nodeName == "to"){
                        //x
                        x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x < 0 || x == null || x > 1 || isNaN(x))
                            return "invalid x value for perspective view to";
                        perspective.near.x = x;
                        //y
                        y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y < 0 || y == null || y > 1 || isNaN(y))
                            return "invalid y value for perspective view to";
                        perspective.near.y = y;
                        //z
                        z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z < 0 || z == null || z > 1 || isNaN(z))
                            return "invalid z value for perspective view to";
                        perspective.near.z = z;
                    }
                    //Unknown
                    else{
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + "> in perspective view");
                        continue;
                    }

                }

            }
            //Orthographic
            else if(children[i].nodeName == "ortho"){

                var orthographic = {
                    id: "",
                    near: 0,
                    far: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                };

                //Id
                orthographic.id = this.reader.getString(children[i], 'id');
                if (orthographic.id == null)
                    return "no ID defined for orthographic view";

                //Near
                orthographic.near = this.reader.getFloat(children[i], 'near');
                if (orthographic.near == null || orthographic.near < 0 || isNaN(orthographic.near))
                    return "no near defined for orthographic view";

                //Far
                orthographic.far = this.reader.getFloat(children[i], 'far');
                if (orthographic.far == null || orthographic.far < 0 || isNaN(orthographic.far))
                    return "no far defined for orthographic view";

                //Left
                orthographic.left = this.reader.getFloat(children[i], 'left');
                if (orthographic.left == null || orthographic.left < 0 || isNaN(orthographic.left))
                    return "no left defined for orthographic view";
                    
                //Right
                orthographic.right = this.reader.getFloat(children[i], 'right');
                if (orthographic.right == null || orthographic.right < 0 || isNaN(orthographic.right))
                    return "no right defined for orthographic view";  

                //Top
                orthographic.top = this.reader.getFloat(children[i], 'top');
                if (orthographic.top == null || orthographic.top < 0 || isNaN(orthographic.top))
                    return "no top defined for orthographic view";  

                //Bottom
                orthographic.bottom = this.reader.getFloat(children[i], 'bottom');
                if (orthographic.bottom == null || orthographic.bottom < 0 || isNaN(orthographic.bottom))
                    return "no bottom defined for orthographic view";  

            }
            //Unknown tag
            else{
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in views");
                continue;
            }


        }

        this.log("Parsed views");

        return null;
    }

    /**
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {

        //TODO push to this
        this.ambient;

        var children = ambientNode.children;

        for (let i = 0; i < children.length; i++) {

            //Ambient
            if (children[i].nodeName == "ambient") {

                var ambient={
                    r:0,
                    g:0,
                    b:0,
                    a:0
                }

                //r
                ambient.r = this.reader.getFloat(children[i], 'r');
                if (ambient.r<0||ambient.r==null||isNaN(ambient.r)||ambient.r>1) {
                    return "Invalid R value";
                }

                //g
                ambient.g = this.reader.getFloat(children[i], 'g');
                if (ambient.g<0||ambient.g==null||isNaN(ambient.g)||ambient.g>1) {
                    return "Invalid G value";
                }

                //b
                ambient.b = this.reader.getFloat(children[i], 'b');
                if(ambient.b<0||ambient.b==null||isNan(ambient.b)||ambient.b>1){
                    return "Invalid B value";
                }

                //a
                ambient.a = this.reader.getFloat(children[i], 'a');
                if (ambient.a<0||ambient.a==null||isNan(ambient.a)||ambient.a>1) {
                    return "Invalid A value";
                }

            //Background
            } else if (children[i].nodeName == "background") {

                var background={
                    r:0,
                    g:0,
                    b:0,
                    a:0
                }

                //r
                background.r = this.reader.getFloat(children[i], 'r');
                if (background.r<0||background.r==null||isNaN(backgroudn.r)||background.r>1) {
                    return "Invalid R value";
                }

                //g
                background.g = this.reader.getFloat(children[i], 'g');
                if (background.g<0||background.g==null||isNaN(background.g)||background.g>1) {
                    return "Invalid G value";
                }

                //b
                background.b = this.reader.getFloat(children[i], 'b');
                if (background.b<0||background.b==null||isNaN(background.b)||background.b>1) {
                    return "Invalid B value";
                }

                //a
                background.a = this.reader.getFloat(children[i], 'a');
                if (background.a<0||background.a==null||isNaN(background.a)||background.a>1) {
                    return "Invalid A value";
                }
            }
            //Unknown
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in ambient");
                continue;
            }

        }

        this.log("Parsed ambient");

        return null;

    }

    /**
     * TODO Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        this.log("Parsed lights");

        return null;

    }

    /**
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //TODO push to here
        var textures = [];

        //Children
        var children = texturesNode.children;

        for (let i = 0; i < children.length; i++) {
            
            //Texture
            if(children[i].nodeName == "texture"){
                var texture = {
                    id: "",
                    path: ""
                }

                //Id
                texture.id = this.reader.getString(children[i], 'id');
                if (texture.id == null)
                    return "no ID defined for texture";

                //Path
                texture.path = this.reader.getString(children[i], 'path');
                if (texture.path == null)
                    return "no path defined for texture";

            }
            //Unknown
            else{
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in textures");
                continue;
            }
            
        }

        this.log("Parsed textures");

        return null;

    }

    /**
     * TODO Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        //TODO push to here
        this.materials = [];

        //Children

        var children = materialsNode.children;

        for (let i = 0; i < children.length; i++) {

            //Material
            var material = {
                id: "",
                shininess: 0,
                emission: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                },
                ambient: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                },
                diffuse: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                },
                specular: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                },
            }

            //Id
            material.id = this.reader.getString(children[i], 'id');
            if (material.id == null)
                return "no ID defined for material";

            //Shininess
            material.shininess = this.reader.getString(children[i], 'shininess');
            if (material.shininess == null)
                return "no shininess defined for material";

            //Grandchildren
            var grandChildren = children[i].children;

            for (let j = 0; j < grandChildren.length; j++) {
                //TODO from here
            }

        }

        this.log("Parsed materials");

        return null;

    }

    /**
     * TODO Parses the <transformations> node.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        this.log("Parsed transformations");

        return null;

    }

    /**
     * TODO Parses the <primitives> node.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        this.log("Parsed primitives");

        return null;

    }

    /**
     * TODO Parses the <components> node.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        this.log("Parsed components");

        return null;

    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorErro(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}