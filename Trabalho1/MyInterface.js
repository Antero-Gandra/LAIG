/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        return true;
    }

    /**
     * Adds a GUI folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key].enabled;
                group.add(this.scene.lightValues, key);
            }
        }

    }

    addViewsGroup(views) {

        var group = this.gui.addFolder("Views");
        group.open();

        const cameras = Object.keys(views);
        this.currentCam = this.scene.graph.defaultView;

        group.add(this, 'currentCam', cameras).name('Camera').onChange(val => this.scene.selectView(val));
    }

    //Process key down
    processKeyDown(event) {
        if(event.code == "KeyN"){
            var graph = this.scene.graph;
            for (let i = 0; i < graph.components.length; i++) {
                graph.components[i].nextMaterial();
            }
        }
    }

}