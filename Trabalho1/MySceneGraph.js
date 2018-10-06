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

        //Loaded data
        this.idRoot = null;
        this.axisLength = null;
        this.views = [];
        this.defaultView = null;
        this.ambient = {
            ambient: null,
            background: null
        }
        this.lights = [];
        this.textures = [];
        this.materials = [];
        this.transformations = [];
        this.primitives = [];
        this.components = [];

        //Axis coordinates
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
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        //Clear root
        this.idRoot = null;

        //Clear axis length
        this.axisLength = null;

        //Root
        this.idRoot = this.reader.getString(sceneNode, 'root');
        if (this.idRoot == null) {
            return "no root defined"
        }

        //Axis Length
        this.axisLength = this.reader.getFloat(sceneNode, 'axis_length');
        if (this.axisLength <= 0 || isNaN(this.axisLength)) {
            return "invalid axis_length"
        }

        //Parsing complete
        this.log("Parsed scene");

        return null;
    }

    /**
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {

        //Clearing views
        this.views = [];

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
                if (perspective.near < 0 || perspective.near == null || isNaN(perspective.near))
                    return "invalid near plane for perspective view with id: " + perspective.id;

                //Far
                perspective.far = this.reader.getFloat(children[i], 'far');
                if (perspective.far < 0 || perspective.far == null || isNaN(perspective.far))
                    return "invalid far plane for perspective view with id: " + perspective.id;

                //Children of Perspective
                var grandChildren = children[i].children;

                for (let j = 0; j < grandChildren.length; j++) {

                    var x, y, z;

                    //From
                    if (grandChildren[j].nodeName == "from") {
                        //x
                        x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x == null || isNaN(x))
                            return "invalid x value for perspective view from with id: " + perspective.id;
                        perspective.from.x = x;
                        //y
                        y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y == null || isNaN(y))
                            return "invalid y value for perspective view from with id: " + perspective.id;
                        perspective.from.y = y;
                        //z
                        z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z == null || isNaN(z))
                            return "invalid z value for perspective view from with id: " + perspective.id;
                        perspective.from.z = z;
                    }
                    //To
                    else if (grandChildren[j].nodeName == "to") {
                        //x
                        x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x == null || isNaN(x))
                            return "invalid x value for perspective view to with id: " + perspective.id;
                        perspective.to.x = x;
                        //y
                        y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y == null || isNaN(y))
                            return "invalid y value for perspective view to with id: " + perspective.id;
                        perspective.to.y = y;
                        //z
                        z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z == null || isNaN(z))
                            return "invalid z value for perspective view to with id: " + perspective.id;
                        perspective.to.z = z;
                    }
                    //Unknown
                    else {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + "> in perspective view");
                        continue;
                    }

                }

                //Add to views array
                this.views.push(perspective);

            }
            //Orthographic
            else if (children[i].nodeName == "ortho") {

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

                //Check unique ID
                for (let v = 0; v < this.views.length; v++) {
                    if (this.views[v].id == orthographic.id)
                        return "view ID duplicate found for id: " + orthographic.id;
                }

                //Near
                orthographic.near = this.reader.getFloat(children[i], 'near');
                if (orthographic.near == null || orthographic.near < 0 || isNaN(orthographic.near))
                    return "no near defined for orthographic view with id: " + orthographic.id;

                //Far
                orthographic.far = this.reader.getFloat(children[i], 'far');
                if (orthographic.far == null || orthographic.far < 0 || isNaN(orthographic.far))
                    return "no far defined for orthographic view with id: " + orthographic.id;

                //Left
                orthographic.left = this.reader.getFloat(children[i], 'left');
                if (orthographic.left == null || isNaN(orthographic.left))
                    return "no left defined for orthographic view with id: " + orthographic.id;

                //Right
                orthographic.right = this.reader.getFloat(children[i], 'right');
                if (orthographic.right == null || isNaN(orthographic.right))
                    return "no right defined for orthographic view with id: " + orthographic.id;

                //Top
                orthographic.top = this.reader.getFloat(children[i], 'top');
                if (orthographic.top == null || isNaN(orthographic.top))
                    return "no top defined for orthographic view with id: " + orthographic.id;

                //Bottom
                orthographic.bottom = this.reader.getFloat(children[i], 'bottom');
                if (orthographic.bottom == null || isNaN(orthographic.bottom))
                    return "no bottom defined for orthographic view with id: " + orthographic.id;

                //Add to views array
                this.views.push(orthographic);

            }
            //Unknown tag
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in views");
                continue;
            }

        }

        //No views found
        if (this.views.length == 0)
            return "there needs to be at least 1 view defined";

        //Read default ID
        this.defaultView = this.reader.getString(viewsNode, 'default');
        if (this.defaultView == null)
            return "no default view ID defined";

        //Default view not found
        var found = false;
        for (let v = 0; v < this.views.length; v++) {
            if (this.views[v].id == this.defaultView) {
                found = true;
                break;
            }
        }
        if (!found)
            return "default view not found in views list";

        //Parsing complete
        this.log("Parsed views");

        return null;
    }

    /**
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {

        //Clear ambient
        this.ambient = {
            ambient: null,
            background: null
        }

        //Children
        var children = ambientNode.children;

        for (let i = 0; i < children.length; i++) {

            //Ambient
            if (children[i].nodeName == "ambient") {

                var ambient = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                }

                //r
                ambient.r = this.reader.getFloat(children[i], 'r');
                if (ambient.r < 0 || ambient.r == null || isNaN(ambient.r) || ambient.r > 1) {
                    return "Invalid R value";
                }

                //g
                ambient.g = this.reader.getFloat(children[i], 'g');
                if (ambient.g < 0 || ambient.g == null || isNaN(ambient.g) || ambient.g > 1) {
                    return "Invalid G value";
                }

                //b
                ambient.b = this.reader.getFloat(children[i], 'b');
                if (ambient.b < 0 || ambient.b == null || isNaN(ambient.b) || ambient.b > 1) {
                    return "Invalid B value";
                }

                //a
                ambient.a = this.reader.getFloat(children[i], 'a');
                if (ambient.a < 0 || ambient.a == null || isNaN(ambient.a) || ambient.a > 1) {
                    return "Invalid A value";
                }

                //Add ambient
                this.ambient.ambient = ambient;

                //Background
            } else if (children[i].nodeName == "background") {

                var background = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                }

                //r
                background.r = this.reader.getFloat(children[i], 'r');
                if (background.r < 0 || background.r == null || isNaN(background.r) || background.r > 1) {
                    return "Invalid R value";
                }

                //g
                background.g = this.reader.getFloat(children[i], 'g');
                if (background.g < 0 || background.g == null || isNaN(background.g) || background.g > 1) {
                    return "Invalid G value";
                }

                //b
                background.b = this.reader.getFloat(children[i], 'b');
                if (background.b < 0 || background.b == null || isNaN(background.b) || background.b > 1) {
                    return "Invalid B value";
                }

                //a
                background.a = this.reader.getFloat(children[i], 'a');
                if (background.a < 0 || background.a == null || isNaN(background.a) || background.a > 1) {
                    return "Invalid A value";
                }

                //Add ambient
                this.ambient.background = background;

            }
            //Unknown
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in ambient");
                continue;
            }
        }

        //Parsing complete
        this.log("Parsed ambient");

        return null;

    }

    /**
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        //Clear lights array
        this.lights = [];

        //Children
        var children = lightsNode.children;

        for (let i = 0; i < children.length; i++) {

            //Omni
            if (children[i].nodeName == "omni") {
                var omni = {
                    id: "",
                    enabled: "",
                    location: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0
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
                    }
                }

                //Id
                omni.id = this.reader.getString(children[i], 'id');
                if (omni.id == null)
                    return "Invalid id value in omni light";

                //Check unique ID
                for (let v = 0; v < this.lights.length; v++) {
                    if (this.lights[v].id == omni.id)
                        return "omni light ID duplicate found for id: " + omni.id;
                }

                //Enabled
                omni.enabled = this.reader.getBoolean(children[i], 'enabled');
                if (omni.enabled == null)
                    return "Invalid enabled value in omni light with id: " + omni.id;

                //Grandchildren
                var grandChildren = children[i].children;
                for (let j = 0; j < grandChildren.length; j++) {
                    //Location
                    if (grandChildren[j].nodeName == "location") {
                        //x
                        omni.location.x = this.reader.getFloat(grandChildren[j], 'x');
                        if (omni.location.x == null || isNaN(omni.location.x))
                            return "Invalid x value in omni light location with id: " + omni.id;
                        //y
                        omni.location.y = this.reader.getFloat(grandChildren[j], 'y');
                        if (omni.location.y == null || isNaN(omni.location.y))
                            return "Invalid y value in omni light location with id: " + omni.id;
                        //z
                        omni.location.z = this.reader.getFloat(grandChildren[j], 'z');
                        if (omni.location.z == null || isNaN(omni.location.z))
                            return "Invalid z value in omni light location with id: " + omni.id;
                        //w
                        omni.location.w = this.reader.getFloat(grandChildren[j], 'w');
                        if (omni.location.w == null || isNaN(omni.location.w))
                            return "Invalid w value in omni light location with id: " + omni.id;
                    }
                    //Ambient
                    else if (grandChildren[j].nodeName == "ambient") {
                        //r
                        omni.ambient.r = this.reader.getFloat(grandChildren[j], 'r');
                        if (omni.ambient.r < 0 || omni.ambient.r == null || isNaN(omni.ambient.r) || omni.ambient.r > 1)
                            return "Invalid r value in omni light ambient with id: " + omni.id;
                        //g
                        omni.ambient.g = this.reader.getFloat(grandChildren[j], 'g');
                        if (omni.ambient.g < 0 || omni.ambient.g == null || isNaN(omni.ambient.g) || omni.ambient.g > 1)
                            return "Invalid g value in omni light ambient with id: " + omni.id;
                        //b
                        omni.ambient.b = this.reader.getFloat(grandChildren[j], 'b');
                        if (omni.ambient.b < 0 || omni.ambient.b == null || isNaN(omni.ambient.b) || omni.ambient.b > 1)
                            return "Invalid b value in omni light ambient with id: " + omni.id;
                        //a
                        omni.ambient.a = this.reader.getFloat(grandChildren[j], 'a');
                        if (omni.ambient.a < 0 || omni.ambient.a == null || isNaN(omni.ambient.a) || omni.ambient.a > 1)
                            return "Invalid a value in omni light ambient with id: " + omni.id;
                    }
                    //Diffuse
                    else if (grandChildren[j].nodeName == "diffuse") {
                        //r
                        omni.diffuse.r = this.reader.getFloat(grandChildren[j], 'r');
                        if (omni.diffuse.r < 0 || omni.diffuse.r == null || isNaN(omni.diffuse.r) || omni.diffuse.r > 1)
                            return "Invalid r value in omni light diffuse with id: " + omni.id;
                        //g
                        omni.diffuse.g = this.reader.getFloat(grandChildren[j], 'g');
                        if (omni.diffuse.g < 0 || omni.diffuse.g == null || isNaN(omni.diffuse.g) || omni.diffuse.g > 1)
                            return "Invalid g value in omni light diffuse with id: " + omni.id;
                        //b
                        omni.diffuse.b = this.reader.getFloat(grandChildren[j], 'b');
                        if (omni.diffuse.b < 0 || omni.diffuse.b == null || isNaN(omni.diffuse.b) || omni.diffuse.b > 1)
                            return "Invalid b value in omni light diffuse with id: " + omni.id;
                        //a
                        omni.diffuse.a = this.reader.getFloat(grandChildren[j], 'a');
                        if (omni.diffuse.a < 0 || omni.diffuse.a == null || isNaN(omni.diffuse.a) || omni.diffuse.a > 1)
                            return "Invalid a value in omni light diffuse with id: " + omni.id;
                    }
                    //Specular
                    else if (grandChildren[j].nodeName == "specular") {
                        //r
                        omni.specular.r = this.reader.getFloat(grandChildren[j], 'r');
                        if (omni.specular.r < 0 || omni.specular.r == null || isNaN(omni.specular.r) || omni.specular.r > 1)
                            return "Invalid r value in omni light specular with id: " + omni.id;
                        //g
                        omni.specular.g = this.reader.getFloat(grandChildren[j], 'g');
                        if (omni.specular.g < 0 || omni.specular.g == null || isNaN(omni.specular.g) || omni.specular.g > 1)
                            return "Invalid g value in omni light specular with id: " + omni.id;
                        //b
                        omni.specular.b = this.reader.getFloat(grandChildren[j], 'b');
                        if (omni.specular.b < 0 || omni.specular.b == null || isNaN(omni.specular.b) || omni.specular.b > 1)
                            return "Invalid b value in omni light specular with id: " + omni.id;
                        //a
                        omni.specular.a = this.reader.getFloat(grandChildren[j], 'a');
                        if (omni.specular.a < 0 || omni.specular.a == null || isNaN(omni.specular.a) || omni.specular.a > 1)
                            return "Invalid a value in omni light specular with id: " + omni.id;
                    }
                    //Unknown
                    else {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + "> in omni light with id: " + omni.id);
                        continue;
                    }
                }

                //Add omni to array
                this.lights.push(omni);

            }
            //Spot
            else if (children[i].nodeName == "spot") {
                var spot = {
                    id: "",
                    enabled: "",
                    angle: 0,
                    exponent: 0,
                    location: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0
                    },
                    target: {
                        x: 0,
                        y: 0,
                        z: 0
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
                    }
                }

                //Id
                spot.id = this.reader.getString(children[i], 'id');
                if (spot.id == null)
                    return "Invalid id value in spot light";

                //Check unique ID
                for (let v = 0; v < this.lights.length; v++) {
                    if (this.lights[v].id == spot.id)
                        return "spot light ID duplicate found for id: " + spot.id;
                }

                //Enabled
                spot.enabled = this.reader.getBoolean(children[i], 'enabled');
                if (spot.enabled == null)
                    return "Invalid enabled value in spot light with id: " + spot.id;

                //Angle
                spot.angle = this.reader.getFloat(children[i], 'angle');
                if (spot.angle < 0 || spot.angle == null || isNaN(spot.angle))
                    return "Invalid a angle value in spot light with id: " + spot.id;

                //Exponent
                spot.exponent = this.reader.getFloat(children[i], 'exponent');
                if (spot.exponent < 0 || spot.exponent == null || isNaN(spot.exponent))
                    return "Invalid a exponent value in spot light with id: " + spot.id;

                //Grandchildren
                var grandChildren = children[i].children;
                for (let j = 0; j < grandChildren.length; j++) {
                    //Location
                    if (grandChildren[j].nodeName == "location") {
                        //x
                        spot.location.x = this.reader.getFloat(grandChildren[j], 'x');
                        if (spot.location.x == null || isNaN(spot.location.x))
                            return "Invalid x value in spot light location with id: " + spot.id;
                        //y
                        spot.location.y = this.reader.getFloat(grandChildren[j], 'y');
                        if (spot.location.y == null || isNaN(spot.location.y))
                            return "Invalid y value in spot light location with id: " + spot.id;
                        //z
                        spot.location.z = this.reader.getFloat(grandChildren[j], 'z');
                        if (spot.location.z == null || isNaN(spot.location.z))
                            return "Invalid z value in spot light location with id: " + spot.id;
                        //w
                        spot.location.w = this.reader.getFloat(grandChildren[j], 'w');
                        if (spot.location.w == null || isNaN(spot.location.w))
                            return "Invalid w value in spot light location with id: " + spot.id;
                    }
                    //Target
                    else if (grandChildren[j].nodeName == "target") {
                        //x
                        spot.target.x = this.reader.getFloat(grandChildren[j], 'x');
                        if (spot.target.x == null || isNaN(spot.target.x))
                            return "Invalid x value in spot light target with id: " + spot.id;
                        //y
                        spot.target.y = this.reader.getFloat(grandChildren[j], 'y');
                        if (spot.target.y == null || isNaN(spot.target.y))
                            return "Invalid y value in spot light target with id: " + spot.id;
                        //z
                        spot.target.z = this.reader.getFloat(grandChildren[j], 'z');
                        if (spot.target.z == null || isNaN(spot.target.z))
                            return "Invalid z value in spot light target with id: " + spot.id;
                    }
                    //Ambient
                    else if (grandChildren[j].nodeName == "ambient") {
                        //r
                        spot.ambient.r = this.reader.getFloat(grandChildren[j], 'r');
                        if (spot.ambient.r < 0 || spot.ambient.r == null || isNaN(spot.ambient.r) || spot.ambient.r > 1)
                            return "Invalid r value in spot light ambient with id: " + spot.id;
                        //g
                        spot.ambient.g = this.reader.getFloat(grandChildren[j], 'g');
                        if (spot.ambient.g < 0 || spot.ambient.g == null || isNaN(spot.ambient.g) || spot.ambient.g > 1)
                            return "Invalid g value in spot light ambient with id: " + spot.id;
                        //b
                        spot.ambient.b = this.reader.getFloat(grandChildren[j], 'b');
                        if (spot.ambient.b < 0 || spot.ambient.b == null || isNaN(spot.ambient.b) || spot.ambient.b > 1)
                            return "Invalid b value in spot light ambient with id: " + spot.id;
                        //a
                        spot.ambient.a = this.reader.getFloat(grandChildren[j], 'a');
                        if (spot.ambient.a < 0 || spot.ambient.a == null || isNaN(spot.ambient.a) || spot.ambient.a > 1)
                            return "Invalid a value in spot light ambient with id: " + spot.id;
                    }
                    //Diffuse
                    else if (grandChildren[j].nodeName == "diffuse") {
                        //r
                        spot.diffuse.r = this.reader.getFloat(grandChildren[j], 'r');
                        if (spot.diffuse.r < 0 || spot.diffuse.r == null || isNaN(spot.diffuse.r) || spot.diffuse.r > 1)
                            return "Invalid r value in spot light diffuse with id: " + spot.id;
                        //g
                        spot.diffuse.g = this.reader.getFloat(grandChildren[j], 'g');
                        if (spot.diffuse.g < 0 || spot.diffuse.g == null || isNaN(spot.diffuse.g) || spot.diffuse.g > 1)
                            return "Invalid g value in spot light diffuse with id: " + spot.id;
                        //b
                        spot.diffuse.b = this.reader.getFloat(grandChildren[j], 'b');
                        if (spot.diffuse.b < 0 || spot.diffuse.b == null || isNaN(spot.diffuse.b) || spot.diffuse.b > 1)
                            return "Invalid b value in spot light diffuse with id: " + spot.id;
                        //a
                        spot.diffuse.a = this.reader.getFloat(grandChildren[j], 'a');
                        if (spot.diffuse.a < 0 || spot.diffuse.a == null || isNaN(spot.diffuse.a) || spot.diffuse.a > 1)
                            return "Invalid a value in spot light diffuse with id: " + spot.id;
                    }
                    //Specular
                    else if (grandChildren[j].nodeName == "specular") {
                        //r
                        spot.specular.r = this.reader.getFloat(grandChildren[j], 'r');
                        if (spot.specular.r < 0 || spot.specular.r == null || isNaN(spot.specular.r) || spot.specular.r > 1)
                            return "Invalid r value in spot light specular with id: " + spot.id;
                        //g
                        spot.specular.g = this.reader.getFloat(grandChildren[j], 'g');
                        if (spot.specular.g < 0 || spot.specular.g == null || isNaN(spot.specular.g) || spot.specular.g > 1)
                            return "Invalid g value in spot light specular with id: " + spot.id;
                        //b
                        spot.specular.b = this.reader.getFloat(grandChildren[j], 'b');
                        if (spot.specular.b < 0 || spot.specular.b == null || isNaN(spot.specular.b) || spot.specular.b > 1)
                            return "Invalid b value in spot light specular with id: " + spot.id;
                        //a
                        spot.specular.a = this.reader.getFloat(grandChildren[j], 'a');
                        if (spot.specular.a < 0 || spot.specular.a == null || isNaN(spot.specular.a) || spot.specular.a > 1)
                            return "Invalid a value in spot light specular with id: " + spot.id;
                    }
                    //Unknown
                    else {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + "> in spot light with id: " + spot.id);
                        continue;
                    }
                }

                //Add spot to array
                this.lights.push(spot);

            }
            //Unknown 
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in lights");
                continue;
            }
        }

        //Parsing complete
        this.log("Parsed lights");

        return null;

    }


    /**
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //Clear textures array
        this.textures = [];

        //Children
        var children = texturesNode.children;

        for (let i = 0; i < children.length; i++) {

            //Texture
            if (children[i].nodeName == "texture") {
                var texture = {
                    id: "",
                    path: ""
                }

                //Id
                texture.id = this.reader.getString(children[i], 'id');
                if (texture.id == null)
                    return "no ID defined for texture";

                //Check unique ID
                for (let v = 0; v < this.textures.length; v++) {
                    if (this.textures[v].id == texture.id)
                        return "texture ID duplicate found for id: " + texture.id;
                }

                //Path
                texture.file = this.reader.getString(children[i], 'file');
                if (texture.file == null)
                    return "no file defined for texture with id: " + texture.id;

                //Add texture to array
                this.textures.push(texture);

            }
            //Unknown
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in textures");
                continue;
            }

        }

        this.log("Parsed textures");

        return null;

    }

    /**
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        //Clear materials array
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

            //Check unique ID
            for (let v = 0; v < this.materials.length; v++) {
                if (this.materials[v].id == material.id)
                    return "material ID duplicate found for id: " + material.id;
            }

            //Shininess
            material.shininess = this.reader.getString(children[i], 'shininess');
            if (material.shininess == null || isNaN(material.shininess))
                return "invalid shininess defined for material with id: " + material.id;

            //Grandchildren
            var grandChildren = children[i].children;

            for (let j = 0; j < grandChildren.length; j++) {
                //Emission
                if (grandChildren[j].nodeName == "emission") {
                    //r
                    material.emission.r = this.reader.getFloat(grandChildren[j], 'r');
                    if (material.emission.r < 0 || material.emission.r == null || isNaN(material.emission.r) || material.emission.r > 1)
                        return "Invalid r value in material emission with id: " + material.id;
                    //g
                    material.emission.g = this.reader.getFloat(grandChildren[j], 'g');
                    if (material.emission.g < 0 || material.emission.g == null || isNaN(material.emission.g) || material.emission.g > 1)
                        return "Invalid g value in material emission with id: " + material.id;
                    //b
                    material.emission.b = this.reader.getFloat(grandChildren[j], 'b');
                    if (material.emission.b < 0 || material.emission.b == null || isNaN(material.emission.b) || material.emission.b > 1)
                        return "Invalid b value in material emission with id: " + material.id;
                    //a
                    material.emission.a = this.reader.getFloat(grandChildren[j], 'a');
                    if (material.emission.a < 0 || material.emission.a == null || isNaN(material.emission.a) || material.emission.a > 1)
                        return "Invalid a value in material emission with id: " + material.id;
                }
                //Ambient
                else if (grandChildren[j].nodeName == "ambient") {
                    //r
                    material.ambient.r = this.reader.getFloat(grandChildren[j], 'r');
                    if (material.ambient.r < 0 || material.ambient.r == null || isNaN(material.ambient.r) || material.ambient.r > 1)
                        return "Invalid r value in material ambient with id: " + material.id;
                    //g
                    material.ambient.g = this.reader.getFloat(grandChildren[j], 'g');
                    if (material.ambient.g < 0 || material.ambient.g == null || isNaN(material.ambient.g) || material.ambient.g > 1)
                        return "Invalid g value in material ambient with id: " + material.id;
                    //b
                    material.ambient.b = this.reader.getFloat(grandChildren[j], 'b');
                    if (material.ambient.b < 0 || material.ambient.b == null || isNaN(material.ambient.b) || material.ambient.b > 1)
                        return "Invalid b value in material ambient with id: " + material.id;
                    //a
                    material.ambient.a = this.reader.getFloat(grandChildren[j], 'a');
                    if (material.ambient.a < 0 || material.ambient.a == null || isNaN(material.ambient.a) || material.ambient.a > 1)
                        return "Invalid a value in material ambient with id: " + material.id;
                }
                //Diffuse
                else if (grandChildren[j].nodeName == "diffuse") {
                    //r
                    material.diffuse.r = this.reader.getFloat(grandChildren[j], 'r');
                    if (material.diffuse.r < 0 || material.diffuse.r == null || isNaN(material.diffuse.r) || material.diffuse.r > 1)
                        return "Invalid r value in material diffuse with id: " + material.id;
                    //g
                    material.diffuse.g = this.reader.getFloat(grandChildren[j], 'g');
                    if (material.diffuse.g < 0 || material.diffuse.g == null || isNaN(material.diffuse.g) || material.diffuse.g > 1)
                        return "Invalid g value in material diffuse with id: " + material.id;
                    //b
                    material.diffuse.b = this.reader.getFloat(grandChildren[j], 'b');
                    if (material.diffuse.b < 0 || material.diffuse.b == null || isNaN(material.diffuse.b) || material.diffuse.b > 1)
                        return "Invalid b value in material diffuse with id: " + material.id;
                    //a
                    material.diffuse.a = this.reader.getFloat(grandChildren[j], 'a');
                    if (material.diffuse.a < 0 || material.diffuse.a == null || isNaN(material.diffuse.a) || material.diffuse.a > 1)
                        return "Invalid a value in material diffuse with id: " + material.id;
                }
                //Specular
                else if (grandChildren[j].nodeName == "specular") {
                    //r
                    material.specular.r = this.reader.getFloat(grandChildren[j], 'r');
                    if (material.specular.r < 0 || material.specular.r == null || isNaN(material.specular.r) || material.specular.r > 1)
                        return "Invalid r value in material specular with id: " + material.id;
                    //g
                    material.specular.g = this.reader.getFloat(grandChildren[j], 'g');
                    if (material.specular.g < 0 || material.specular.g == null || isNaN(material.specular.g) || material.specular.g > 1)
                        return "Invalid g value in material specular with id: " + material.id;
                    //b
                    material.specular.b = this.reader.getFloat(grandChildren[j], 'b');
                    if (material.specular.b < 0 || material.specular.b == null || isNaN(material.specular.b) || material.specular.b > 1)
                        return "Invalid b value in material specular with id: " + material.id;
                    //a
                    material.specular.a = this.reader.getFloat(grandChildren[j], 'a');
                    if (material.specular.a < 0 || material.specular.a == null || isNaN(material.specular.a) || material.specular.a > 1)
                        return "Invalid a value in material specular with id: " + material.id;
                }
                //Unknown
                else {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + "> in materials");
                    continue;
                }
            }

            //Add material to array
            this.materials.push(material);

        }

        //Parsing complete
        this.log("Parsed materials");

        return null;

    }

    /**
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        //Clear transformations array
        this.transformations = [];

        //Children
        var children = transformationsNode.children;

        for (let i = 0; i < children.length; i++) {

            //Transformation
            if (children[i].nodeName == "transformation") {

                var transformation = {
                    id: "",
                    list: []
                }

                //Id
                transformation.id = this.reader.getString(children[i], 'id');
                if (transformation.id == null)
                    return "no ID defined for transformation";

                //Check unique ID
                for (let v = 0; v < this.transformations.length; v++) {
                    if (this.transformations[v].id == transformation.id)
                        return "transformation ID duplicate found for id: " + transformation.id;
                }

                //Grandchildren
                var grandChildren = children[i].children;
                for (let j = 0; j < grandChildren.length; j++) {

                    //Translate
                    if (grandChildren[j].nodeName == "translate") {
                        var translate = {
                            x: 0,
                            y: 0,
                            z: 0
                        }

                        //x
                        translate.x = this.reader.getFloat(grandChildren[j], 'x');
                        if (translate.x == null || isNaN(translate.x))
                            return "Invalid x value in transformation translate with id: " + transformation.id;
                        //y
                        translate.y = this.reader.getFloat(grandChildren[j], 'y');
                        if (translate.y == null || isNaN(translate.y))
                            return "Invalid y value in transformation translate with id: " + transformation.id;
                        //z
                        translate.z = this.reader.getFloat(grandChildren[j], 'z');
                        if (translate.z == null || isNaN(translate.z))
                            return "Invalid z value in transformation translate with id: " + transformation.id;

                        //Add to transformations
                        transformation.list.push(translate);
                    }
                    //Rotate
                    else if (grandChildren[j].nodeName == "rotate") {
                        var rotate = {
                            axis: "",
                            angle: 0
                        }

                        //axis
                        rotate.axis = this.reader.getString(grandChildren[j], 'axis');
                        if (rotate.axis != "x" && rotate.axis != "y" && rotate.axis != "z")
                            return "Invalid axis value in transformation rotate with id: " + transformation.id;
                        //angle
                        rotate.angle = this.reader.getFloat(grandChildren[j], 'angle');
                        if (rotate.angle == null || isNaN(rotate.angle))
                            return "Invalid angle value in transformation rotate with id: " + transformation.id;

                        //Add to transformations
                        transformation.list.push(rotate);
                    }
                    //Scale
                    else if (grandChildren[j].nodeName == "scale") {
                        var scale = {
                            x: 0,
                            y: 0,
                            z: 0
                        }

                        //x
                        scale.x = this.reader.getFloat(grandChildren[j], 'x');
                        if (scale.x == null || isNaN(scale.x))
                            return "Invalid x value in transformation scale with id: " + transformation.id;
                        //y
                        scale.y = this.reader.getFloat(grandChildren[j], 'y');
                        if (scale.y == null || isNaN(scale.y))
                            return "Invalid y value in transformation scale with id: " + transformation.id;
                        //z
                        scale.z = this.reader.getFloat(grandChildren[j], 'z');
                        if (scale.z == null || isNaN(scale.z))
                            return "Invalid z value in transformation scale with id: " + transformation.id;

                        //Add to transformations
                        transformation.list.push(scale);
                    }
                    //Unknown
                    else {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + "> in transformation with id: " + transformation.id);
                        continue;
                    }
                }

                //Check empty transformation
                if (transformation.list.length == 0)
                    return "empty transformation list in transformation with id: " + transformation.id;

                //Add to transformations array
                this.transformations.push(transformation);

            }
            //Unknown
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in transformations");
                continue;
            }
        }

        //Parsing complete
        this.log("Parsed transformations");

        return null;

    }

    /**
     * @param {primitives block element} primitivesNode
     * TODO update array to have shape as a CGF Object (like rectangle already)
     */
    parsePrimitives(primitivesNode) {

        //Clear primitives array
        this.primitives = [];

        //Children
        var children = primitivesNode.children;

        for (let i = 0; i < children.length; i++) {

            //Primitive
            if (children[i].nodeName == "primitive") {
                var primitive = {
                    id: 0,
                    shape: null
                }

                //Id
                primitive.id = this.reader.getString(children[i], 'id');
                if (primitive.id == null)
                    return "no ID defined for primitive";

                //Check unique ID
                for (let v = 0; v < this.primitives.length; v++) {
                    if (this.primitives[v].id == primitive.id)
                        return "primitive ID duplicate found for id: " + primitive.id;
                }

                //Grandchildren
                var grandChildren = children[i].children;

                for (let j = 0; j < grandChildren.length; j++) {
                    //Rectangle
                    if (grandChildren[j].nodeName == "rectangle") {
                        var rectangle = {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 0
                        }

                        //x1
                        rectangle.x1 = this.reader.getFloat(grandChildren[j], 'x1');
                        if (rectangle.x1 == null || isNaN(rectangle.x1))
                            return "Invalid x1 value in rectangle primitive with id: " + primitive.id;
                        //y1
                        rectangle.y1 = this.reader.getFloat(grandChildren[j], 'y1');
                        if (rectangle.y1 == null || isNaN(rectangle.y1))
                            return "Invalid y1 value in rectangle primitive with id: " + primitive.id;
                        //x2
                        rectangle.x2 = this.reader.getFloat(grandChildren[j], 'x2');
                        if (rectangle.x2 == null || isNaN(rectangle.x2))
                            return "Invalid x2 value in rectangle primitive with id: " + primitive.id;
                        //y2
                        rectangle.y2 = this.reader.getFloat(grandChildren[j], 'y2');
                        if (rectangle.y2 == null || isNaN(rectangle.y2))
                            return "Invalid y2 value in rectangle primitive with id: " + primitive.id;

                        //Add to primitive and break out of loop(only 1 "shape" per primitive)
                        primitive.shape = new Rectangle(this.scene, rectangle.x1, rectangle.y1, rectangle.x2, rectangle.y2);
                        break;
                    }
                    //Triangle
                    else if (grandChildren[j].nodeName == "triangle") {
                        var triangle = {
                            x1: 0,
                            y1: 0,
                            z1: 0,
                            x2: 0,
                            y2: 0,
                            z2: 0,
                            x3: 0,
                            y3: 0,
                            z3: 0
                        }

                        //x1
                        triangle.x1 = this.reader.getFloat(grandChildren[j], 'x1');
                        if (triangle.x1 == null || isNaN(triangle.x1))
                            return "Invalid x1 value in triangle primitive with id: " + primitive.id;
                        //y1
                        triangle.y1 = this.reader.getFloat(grandChildren[j], 'y1');
                        if (triangle.y1 == null || isNaN(triangle.y1))
                            return "Invalid y1 value in triangle primitive with id: " + primitive.id;
                        //z1
                        triangle.z1 = this.reader.getFloat(grandChildren[j], 'z1');
                        if (triangle.z1 == null || isNaN(triangle.z1))
                            return "Invalid z1 value in triangle primitive with id: " + primitive.id;
                        //x2
                        triangle.x2 = this.reader.getFloat(grandChildren[j], 'x2');
                        if (triangle.x2 == null || isNaN(triangle.x2))
                            return "Invalid x2 value in triangle primitive with id: " + primitive.id;
                        //y2
                        triangle.y2 = this.reader.getFloat(grandChildren[j], 'y2');
                        if (triangle.y2 == null || isNaN(triangle.y2))
                            return "Invalid y2 value in triangle primitive with id: " + primitive.id;
                        //z2
                        triangle.z2 = this.reader.getFloat(grandChildren[j], 'z2');
                        if (triangle.z2 == null || isNaN(triangle.z2))
                            return "Invalid z2 value in triangle primitive with id: " + primitive.id;
                        //x3
                        triangle.x3 = this.reader.getFloat(grandChildren[j], 'x3');
                        if (triangle.x3 == null || isNaN(triangle.x3))
                            return "Invalid x3 value in triangle primitive with id: " + primitive.id;
                        //y3
                        triangle.y3 = this.reader.getFloat(grandChildren[j], 'y3');
                        if (triangle.y3 == null || isNaN(triangle.y3))
                            return "Invalid y3 value in triangle primitive with id: " + primitive.id;
                        //z3
                        triangle.z3 = this.reader.getFloat(grandChildren[j], 'z3');
                        if (triangle.z3 == null || isNaN(triangle.z3))
                            return "Invalid z3 value in triangle primitive with id: " + primitive.id;

                        //Add to primitive and break out of loop(only 1 "shape" per primitive)
                        primitive.shape = triangle;
                        break;
                    }
                    //Cylinder
                    else if (grandChildren[j].nodeName == "cylinder") {
                        var cylinder = {
                            base: 0,
                            top: 0,
                            height: 0,
                            slices: 0,
                            stacks: 0
                        }

                        //base
                        cylinder.base = this.reader.getFloat(grandChildren[j], 'base');
                        if (cylinder.base == null || isNaN(cylinder.base) || cylinder.base < 0)
                            return "Invalid base value in cylinder primitive with id: " + primitive.id;
                        //top
                        cylinder.top = this.reader.getFloat(grandChildren[j], 'top');
                        if (cylinder.top == null || isNaN(cylinder.top) || cylinder.top < 0)
                            return "Invalid top value in cylinder primitive with id: " + primitive.id;
                        //height
                        cylinder.height = this.reader.getFloat(grandChildren[j], 'height');
                        if (cylinder.height == null || isNaN(cylinder.height) || cylinder.height < 0)
                            return "Invalid height value in cylinder primitive with id: " + primitive.id;
                        //slices
                        cylinder.slices = this.reader.getFloat(grandChildren[j], 'slices');
                        if (cylinder.slices == null || isNaN(cylinder.slices) || cylinder.slices < 0)
                            return "Invalid slices value in cylinder primitive with id: " + primitive.id;
                        //stacks
                        cylinder.stacks = this.reader.getFloat(grandChildren[j], 'stacks');
                        if (cylinder.stacks == null || isNaN(cylinder.stacks) || cylinder.stacks < 0)
                            return "Invalid stacks value in cylinder primitive with id: " + primitive.id;

                        //Add to primitive and break out of loop(only 1 "shape" per primitive)
                        primitive.shape = cylinder;
                        break;
                    }
                    //Sphere
                    else if (grandChildren[j].nodeName == "sphere") {
                        var sphere = {
                            radius: 0,
                            slices: 0,
                            stacks: 0
                        }

                        //radius
                        sphere.radius = this.reader.getFloat(grandChildren[j], 'radius');
                        if (sphere.radius == null || isNaN(sphere.radius) || sphere.radius < 0)
                            return "Invalid radius value in sphere primitive with id: " + primitive.id;
                        //slices
                        sphere.slices = this.reader.getFloat(grandChildren[j], 'slices');
                        if (sphere.slices == null || isNaN(sphere.slices) || sphere.slices < 0)
                            return "Invalid slices value in sphere primitive with id: " + primitive.id;
                        //stacks
                        sphere.stacks = this.reader.getFloat(grandChildren[j], 'stacks');
                        if (sphere.stacks == null || isNaN(sphere.stacks) || sphere.stacks < 0)
                            return "Invalid stacks value in sphere primitive with id: " + primitive.id;

                        //Add to primitive and break out of loop(only 1 "shape" per primitive)
                        primitive.shape = sphere;
                        break;
                    }
                    //Torus
                    else if (grandChildren[j].nodeName == "torus") {
                        var torus = {
                            inner: 0,
                            outer: 0,
                            slices: 0,
                            loops: 0
                        }

                        //inner
                        torus.inner = this.reader.getFloat(grandChildren[j], 'inner');
                        if (torus.inner == null || isNaN(torus.inner) || torus.inner < 0)
                            return "Invalid inner value in torus primitive with id: " + primitive.id;
                        //outer
                        torus.outer = this.reader.getFloat(grandChildren[j], 'outer');
                        if (torus.outer == null || isNaN(torus.outer) || torus.outer < 0)
                            return "Invalid outer value in torus primitive with id: " + primitive.id;
                        //slices
                        torus.slices = this.reader.getFloat(grandChildren[j], 'slices');
                        if (torus.slices == null || isNaN(torus.slices) || torus.slices < 0)
                            return "Invalid slices value in torus primitive with id: " + primitive.id;
                        //loops
                        torus.loops = this.reader.getFloat(grandChildren[j], 'loops');
                        if (torus.loops == null || isNaN(torus.loops) || torus.loops < 0)
                            return "Invalid loops value in torus primitive with id: " + primitive.id;

                        //Add to primitive and break out of loop(only 1 "shape" per primitive)
                        primitive.shape = torus;
                        break;
                    }
                    //Unknown
                    else {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + "> in primitive with id: " + primitive.id);
                        continue;
                    }
                }
            }
            //Unknown
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in primitives");
                continue;
            }

            //Add to primitives array
            this.primitives.push(primitive);

        }

        //Parsing complete
        this.log("Parsed primitives");

        return null;

    }

    /**
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        //Clear components array
        this.components = [];
        this.tmpComponents = [];

        //Children
        var children = componentsNode.children;

        for (let i = 0; i < children.length; i++) {

            //Component
            if (children[i].nodeName == "component") {

                var component = {
                    id: "",
                    transformations_ref: null,
                    transformations_list: [],
                    materials: [],
                    texture: {
                        id: "",
                        length_s: 1,
                        length_t: 1
                    },
                    childrenComponents: [],
                    childrenPrimitives: []
                }

                //ID
                component.id = this.reader.getString(children[i], 'id');
                if (component.id == null)
                    return "no ID defined for component";

                //Check unique ID
                for (let v = 0; v < this.components.length; v++) {
                    if (this.components[v].id == component.id)
                        return "component ID duplicate found for id: " + component.id;
                }

                //Grandchildren
                var grandChildren = children[i].children;
                for (let j = 0; j < grandChildren.length; j++) {

                    //Transformation
                    if (grandChildren[j].nodeName == "transformation") {

                        //Transformation Grandgrandchildren
                        var grandGrandChildren = grandChildren[j].children;
                        for (let h = 0; h < grandGrandChildren.length; h++) {

                            //TransformationRef
                            if (grandGrandChildren[h].nodeName == "transformationref") {

                                //ID
                                component.transformations_ref = this.reader.getString(grandGrandChildren[h], 'id');
                                if (component.transformations_ref == null)
                                    return "no ID defined for component transformations_ref with id: " + component.id;

                                //Check ID exists
                                var found = false;
                                for (let v = 0; v < this.transformations.length; v++) {
                                    if (this.transformations[v].id == component.transformations_ref) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found)
                                    return "transformations_ref not found in transformations array with id: " + component.transformations_ref

                                //Found transformationref, we can ignore transformation list and break;
                                component.transformations_list = [];
                                break;

                            }
                            //Translate
                            else if (grandGrandChildren[h].nodeName == "translate") {
                                var translate = {
                                    x: 0,
                                    y: 0,
                                    z: 0
                                }

                                //x
                                translate.x = this.reader.getFloat(grandGrandChildren[h], 'x');
                                if (translate.x == null || isNaN(translate.x))
                                    return "Invalid x value in component explicit transformation translate with id: " + component.id;
                                //y
                                translate.y = this.reader.getFloat(grandGrandChildren[h], 'y');
                                if (translate.y == null || isNaN(translate.y))
                                    return "Invalid y value in component explicit transformation translate with id: " + component.id;
                                //z
                                translate.z = this.reader.getFloat(grandGrandChildren[h], 'z');
                                if (translate.z == null || isNaN(translate.z))
                                    return "Invalid z value in component explicit transformation translate with id: " + component.id;

                                //Add to transformations
                                component.transformations_list.push(translate);
                            }
                            //Rotate
                            else if (grandGrandChildren[h].nodeName == "rotate") {
                                var rotate = {
                                    axis: "",
                                    angle: 0
                                }

                                //axis
                                rotate.axis = this.reader.getString(grandGrandChildren[h], 'axis');
                                if (rotate.axis != "x" && rotate.axis != "y" && rotate.axis != "z")
                                    return "Invalid axis value in component explicit transformation rotate with id: " + component.id;
                                //angle
                                rotate.angle = this.reader.getFloat(grandGrandChildren[h], 'angle');
                                if (rotate.angle == null || isNaN(rotate.angle))
                                    return "Invalid angle value in component explicit transformation rotate with id: " + component.id;

                                //Add to transformations
                                component.transformations_list.push(rotate);
                            }
                            //Scale
                            else if (grandGrandChildren[h].nodeName == "scale") {
                                var scale = {
                                    x: 0,
                                    y: 0,
                                    z: 0
                                }

                                //x
                                scale.x = this.reader.getFloat(grandGrandChildren[h], 'x');
                                if (scale.x == null || isNaN(scale.x))
                                    return "Invalid x value in component explicit transformation scale with id: " + component.id;
                                //y
                                scale.y = this.reader.getFloat(grandGrandChildren[h], 'y');
                                if (scale.y == null || isNaN(scale.y))
                                    return "Invalid y value in component explicit transformation scale with id: " + component.id;
                                //z
                                scale.z = this.reader.getFloat(grandGrandChildren[h], 'z');
                                if (scale.z == null || isNaN(scale.z))
                                    return "Invalid z value in component explicit transformation scale with id: " + component.id;

                                //Add to transformations
                                component.transformations_list.push(scale);
                            }
                            //Unknown
                            else {
                                this.onXMLMinorError("unknown tag <" + grandGrandChildren[h].nodeName + "> in transformations for component with id: " + component.id);
                                continue;
                            }

                        }
                    }
                    //Materials
                    else if (grandChildren[j].nodeName == "materials") {

                        //Materials Grandgrandchildren
                        var grandGrandChildren = grandChildren[j].children;
                        for (let h = 0; h < grandGrandChildren.length; h++) {
                            //Material
                            if (grandGrandChildren[h].nodeName == "material") {
                                //ID
                                var tmp = this.reader.getString(grandGrandChildren[h], 'id');
                                if (tmp == null)
                                    return "no ID defined for component material with id: " + component.id;

                                //Check material ID exists
                                var found = false;
                                for (let v = 0; v < this.materials.length; v++) {
                                    if (this.materials[v].id == tmp) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found)
                                    return "material ID not found in materials array with id: " + tmp;

                                //Add to material list
                                component.materials.push(tmp);
                            }
                            //Unknown
                            else {
                                this.onXMLMinorError("unknown tag <" + grandGrandChildren[h].nodeName + "> in materials for component with id: " + component.id);
                                continue;
                            }
                        }
                    }
                    //Texture
                    else if (grandChildren[j].nodeName == "texture") {

                        //ID
                        component.texture.id = this.reader.getString(grandChildren[j], 'id');
                        if (component.texture.id == null)
                            return "no ID defined for component texture with id: " + component.id;

                        //Check texture ID exists
                        var found = false;
                        for (let v = 0; v < this.textures.length; v++) {
                            if (this.textures[v].id == component.texture.id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                            return "texture ID not found in textures array with id: " + component.texture.id;

                        //length_s
                        component.texture.length_s = this.reader.getFloat(grandChildren[j], 'length_s');
                        if (component.texture.length_s == null || component.texture.length_s <= 0 || isNaN(component.texture.length_s))
                            return "no length_s defined for component texture with id: " + component.id;

                        //length_t
                        component.texture.length_t = this.reader.getFloat(grandChildren[j], 'length_t');
                        if (component.texture.length_t == null || component.texture.length_t <= 0 || isNaN(component.texture.length_t))
                            return "no length_t defined for component texture with id: " + component.id;

                    }
                    //Component Children
                    else if (grandChildren[j].nodeName == "children") {

                        //Component Children Grandgrandchildren
                        var grandGrandChildren = grandChildren[j].children;
                        for (let h = 0; h < grandGrandChildren.length; h++) {

                            //ComponentRef
                            if (grandGrandChildren[h].nodeName == "componentref") {
                                //ID
                                var tmp = this.reader.getString(grandGrandChildren[h], 'id');
                                if (tmp == null)
                                    return "no ID defined for component child componentref with id: " + component.id;

                                //Add ID to list
                                component.childrenComponents.push(tmp);
                            }
                            //PrimitiveRef
                            else if (grandGrandChildren[h].nodeName == "primitiveref") {
                                //ID
                                var tmp = this.reader.getString(grandGrandChildren[h], 'id');
                                if (tmp == null)
                                    return "no ID defined for component child primitiveref with id: " + component.id;

                                //Check PrimitiveRef ID exists
                                var found = false;
                                for (let v = 0; v < this.primitives.length; v++) {
                                    if (this.primitives[v].id == tmp) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found)
                                    return "PrimitiveRef ID not found in primitives array with id: " + tmp;

                                //Add ID to list
                                component.childrenPrimitives.push(tmp);
                            }
                            //Unknown
                            else {
                                this.onXMLMinorError("unknown tag <" + grandGrandChildren[h].nodeName + "> in children for component with id: " + component.id);
                                continue;
                            }

                        }
                    }
                }
            }
            //Unknown
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in components");
                continue;
            }

            //Add to temporary components
            this.tmpComponents.push(component);

        }

        //Check all components have children component with correct ID(after reading all components)
        for (let i = 0; i < this.tmpComponents.length; i++) {
            for (let j = 0; j < this.tmpComponents[i].childrenComponents.length; j++) {
                var found = false;
                for (let h = 0; h < this.tmpComponents.length; h++) {
                    //Don't check with itself
                    if (i == h)
                        continue;
                    //Check if IDs match
                    if (this.tmpComponents[h].id == this.tmpComponents[i].childrenComponents[j]) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                    return "component with id: " + this.tmpComponents[i].id + " has a children component with id: " + this.tmpComponents[i].childrenComponents[j] + " which doesn't exist";
            }
        }

        //Check Components without father
        var fatherless = [];
        for (let i = 0; i < this.tmpComponents.length; i++) {
            var hasFather = false;
            for (let j = 0; j < this.tmpComponents.length; j++) {
                //Don't check with itself
                if (i == j)
                    continue;
                for (let h = 0; h < this.tmpComponents[j].childrenComponents.length; h++) {
                    if (this.tmpComponents[j].childrenComponents[h] == this.tmpComponents[i].id) {
                        hasFather = true;
                        break;
                    }
                }
            }
            //Doesn't have father, add to array
            if (!hasFather)
                fatherless.push(this.tmpComponents[i].id);
        }

        //Make proper components after all error checking
        for (let i = 0; i < this.tmpComponents.length; i++) {
            //Add to components array
            //Explicit transformations
            if (this.tmpComponents.transformations_ref == null) {
                this.components.push(new Component(
                    this.scene,
                    this.tmpComponents[i].id,
                    this.tmpComponents[i].transformations_list,
                    this.tmpComponents[i].materials,
                    this.tmpComponents[i].texture,
                    this.tmpComponents[i].childrenComponents,
                    this.tmpComponents[i].childrenPrimitives));
            }
            //Reference to transformations array
            else {
                this.components.push(new Component(
                    this.scene,
                    this.tmpComponents[i].id,
                    this.tmpComponents[i].transformations_ref,
                    this.tmpComponents[i].materials,
                    this.tmpComponents[i].texture,
                    this.tmpComponents[i].childrenComponents,
                    this.tmpComponents[i].childrenPrimitives));
            }

            //Create root with fatherless components
            this.root = new Component(
                this.scene,
                this.idRoot,
                [],
                null,
                null,
                fatherless,
                []);

        }

        //Parsing complete
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
    onXMLMinorError(message) {
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

        this.scene.pushMatrix();

        //Call draw for root component(father of all components without a father)
        this.root.display();

        this.scene.popMatrix();

    }
}