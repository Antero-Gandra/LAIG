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

        for (let i = 0; i < lights.length; i++) {
            this.scene.lightValues[i] = lights[i].enabled;
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

    //Setup and add UI
    addUI() {

        //Group
        var group = this.gui.addFolder("Lear Game Menu");
        group.open();

        //Settings
        var settingsGroup = group.addFolder("Settings");
        settingsGroup.open();

        //TODO Difficulty
        const difficulty = ["Easy", "Hard"];
        this.difficultySet = "Easy";
        settingsGroup.add(this, 'difficultySet', difficulty).name('Difficulty').onChange(val => this.scene.selectView(val));

        //TODO Mode
        const mode = ["Player vs Player", "Player vs CPU", "CPU vs CPU"];
        this.modeSet = "Player vs Player";
        settingsGroup.add(this, 'modeSet', mode).name('Mode').onChange(val => this.scene.selectView(val));

        //Play Controls
        var playGroup = group.addFolder("Play Controls");
        playGroup.open();

        //TODO Undo
        this.undo = this.scene.resetView;
        playGroup.add(this, 'undo').name('Undo');

        //TODO Redo
        this.redo = this.scene.resetView;
        playGroup.add(this, 'redo').name('Redo');

        //TODO Movie
        this.movie = this.scene.resetView;
        playGroup.add(this, 'movie').name('Movie');

        //View Controls
        var viewGroup = group.addFolder("View");
        viewGroup.open();

        //TODO Scenario
        const scenario = ["Scene1"];
        this.scenarioSet = "Scene1";
        viewGroup.add(this, 'scenarioSet', scenario).name('Scenario').onChange(val => this.scene.selectView(val));

        //TODO Camera
        const camera = ["View1"];
        this.cameraSet = "View1";
        viewGroup.add(this, 'cameraSet', camera).name('Camera').onChange(val => this.scene.selectView(val));

        //TODO New Game
        this.newGame = this.scene.resetView;
        group.add(this, 'newGame').name('New Game');

    }

    //Process mouse down
    processMouseDown(event) {

        this.mouse[0] = event.pageX;
        this.mouse[1] = event.pageY;

        //Click Down
        var result = this.board.raycast.process("pieces");
        if (result != false) {
            this.held = 1;
            this.selectedPiece = result;
            console.log(result);
        }
        else
            console.log("No piece selected");

    }

    //Process mouse up
    processMouseUp(event) {

        this.mouse[0] = event.pageX;
        this.mouse[1] = event.pageY;

        //Piece was being held
        if (this.held == 1) {
            var result = this.board.raycast.process("places");
            if (result != false) {
                console.log(result);
                //Tell board to send a request
                this.board.setPiece(result.i, result.j, this.selectedPiece);
            }
            else
                console.log("Piece released outside board");
            this.selectedPiece.unhover();
        }

        //Certainly we can reset
        this.held = 0;

    }

    //Process mouse move
    processMouseMove(event) {

        this.mouse[0] = event.pageX;
        this.mouse[1] = event.pageY;

        //Held down
        if (this.held == 1) {
            var mousePos = this.board.raycast.process("plane");
            this.selectedPiece.hover(mousePos);
        }

    }


}