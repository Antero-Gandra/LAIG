var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.interface.scene = this;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {

        //Setup lights
        for (let i = 0; i < this.graph.lights.length; i++) {

            const light = this.graph.lights[i];

            this.lights[i].setPosition(light.location.x, light.location.y, light.location.z, light.location.w);
            this.lights[i].setAmbient(light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a);
            this.lights[i].setDiffuse(light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a);
            this.lights[i].setSpecular(light.specular.r, light.specular.g, light.specular.b, light.specular.a);

            //Detect if it's spotlight
            if (light.angle != undefined) {
                this.lights[i].setSpotCutOff(light.angle);
                this.lights[i].setSpotExponent(light.exponent);
                //TODO doesn't seem right
                this.lights[i].setSpotDirection(light.target.x, light.target.y, light.target.z);
            }

            this.lights[i].setVisible(true);

            if (light.enable)
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();
        }

    }

    initViews() {

        //Clear cameras array
        this.cameras = [];

        //Setup views
        for (let i = 0; i < this.graph.views.length; i++) {
            var camera = {
                id: "",
                camera: null
            };
            camera.id = this.graph.views[i].id

            //Detect if perspective
            if (this.graph.views[i].angle != undefined) {
                camera.camera = new CGFcamera(
                    this.graph.views[i].angle * DEGREE_TO_RAD,
                    this.graph.views[i].near,
                    this.graph.views[i].far,
                    vec4.fromValues(this.graph.views[i].from.x, this.graph.views[i].from.y, this.graph.views[i].from.z, 0),
                    vec4.fromValues(this.graph.views[i].to.x, this.graph.views[i].to.y, this.graph.views[i].to.z, 0));
            }
            //Must be ortho then
            else {
                camera.camera = new CGFcameraOrtho(
                    this.graph.views[i].left,
                    this.graph.views[i].right,
                    this.graph.views[i].bottom,
                    this.graph.views[i].top,
                    this.graph.views[i].near,
                    this.graph.views[i].far,
                    vec3.fromValues(this.graph.views[i].from.x, this.graph.views[i].from.y, this.graph.views[i].from.z),
                    vec3.fromValues(this.graph.views[i].to.x, this.graph.views[i].to.y, this.graph.views[i].to.z),
                    vec3.fromValues(0, -1, 0))
            }

            //Add to cameras array
            this.cameras.push(camera);

        }

        //Set default camera
        for (let i = 0; i < this.cameras.length; i++) {
            if (this.cameras[i].id == this.graph.defaultView) {
                this.camera = this.cameras[i].camera;
                this.interface.setActiveCamera(this.camera);
                break;
            }
        }

    }

    /**
     * Initializes the views
     */
    selectView(id) {
        //Search ID
        for (let i = 0; i < this.cameras.length; i++) {
            if (this.cameras[i].id == id) {
                this.camera = this.cameras[i].camera;
                this.interface.setActiveCamera(this.camera);
            }
        }
    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        //Load texture files
        for (let i = 0; i < this.graph.textures.length; i++) {
            var loadedTexture = {
                id: "",
                tex: null
            }

            loadedTexture.id = this.graph.textures[i].id;
            loadedTexture.tex = new CGFtexture(this, "scenes/" + this.graph.textures[i].file);

            this.graph.loadedTextures.push(loadedTexture);
        }

        //Change ambient
        this.setGlobalAmbientLight(this.graph.ambient.ambient.r, this.graph.ambient.ambient.g, this.graph.ambient.ambient.b, this.graph.ambient.ambient.a);

        //Change background
        this.gl.clearColor(this.graph.ambient.background.r, this.graph.ambient.background.g, this.graph.ambient.background.b, this.graph.ambient.background.a);

        //Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axisLength);

        //Initialize lights
        this.initLights();

        //Initialize views
        this.initViews();

        //Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        //Adds views group.
        this.interface.addViewsGroup(this.graph.views);

        //Mark scene as initialized
        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        //Was the graph loaded already?
        if (this.sceneInited) {

            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}