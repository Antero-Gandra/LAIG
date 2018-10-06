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
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
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
            if(light.angle != undefined){
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


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        //Change ambient
        this.setGlobalAmbientLight(this.graph.ambient.ambient.r, this.graph.ambient.ambient.g, this.graph.ambient.ambient.b, this.graph.ambient.ambient.a);

        //Change background
        this.gl.clearColor(this.graph.ambient.background.r, this.graph.ambient.background.g, this.graph.ambient.background.b, this.graph.ambient.background.a);

        //Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axisLength);

        //TODO Load initial camera      

        //Initialize lights
        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

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