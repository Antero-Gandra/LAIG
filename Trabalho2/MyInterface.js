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

        for (let i = 0; i < lights.length; i++) {
            this.scene.lightValues[i] = lights[i].enabled;
            group.add(this.scene.lightValues, i).name(this.scene.graph.lights[i].id);
        }

    }

    addViewsGroup() {

        var group = this.gui.addFolder("Views");
        group.open();

        const cameras = [];
        for (let i = 0; i < this.scene.cameras.length; i++) {
            cameras.push(this.scene.cameras[i].id);
        }

        this.currentCam = this.scene.graph.defaultView;

        group.add(this, 'currentCam', cameras).name('Camera').onChange(val => this.scene.selectView(val));

        //Add reset button
        this.resetView = this.scene.resetView;
        group.add(this, 'resetView').name('Reset current view');

    }

    //Process key down
    processKeyDown(event) {
        if(event.code == "KeyM"){
            var graph = this.scene.graph;
            for (let i = 0; i < graph.components.length; i++) {
                graph.components[i].nextMaterial();
            }
        }
    }

}