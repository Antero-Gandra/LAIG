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

        this.playerBlock = false;

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

        //Difficulty
        const difficulty = ["Easy", "Hard"];
        this.difficultySet = "Easy";
        settingsGroup.add(this, 'difficultySet', difficulty).name('Difficulty').onChange(val => this.board.tmpDifficulty = val);

        //Mode
        const mode = ["Player vs Player", "Player vs CPU", "CPU vs CPU"];
        this.modeSet = "Player vs Player";
        settingsGroup.add(this, 'modeSet', mode).name('Mode').onChange(val => this.board.tmpMode = val);

        //New Game
        this.newGame = this.callNewGame;
        settingsGroup.add(this, 'newGame').name('New Game');

        //Play Controls
        var playGroup = group.addFolder("Play Controls");
        playGroup.open();

        //Undo
        this.undo = this.callUndo;
        this.undoBlocked = false;
        playGroup.add(this, 'undo').name('Undo');

        //View Controls
        var viewGroup = group.addFolder("View");
        viewGroup.open();

        //TODO Scenario
        const scenario = ["Scene1"];
        this.scenarioSet = "Scene1";
        viewGroup.add(this, 'scenarioSet', scenario).name('Scenario').onChange(val => this.scene.selectView(val));

        //Camera Zoom In
        this.zoomIn = this.callZoomIn;
        viewGroup.add(this, 'zoomIn').name('Zoom In');

        //Camera Zoom Out
        this.zoomOut = this.callZoomOut;
        viewGroup.add(this, 'zoomOut').name('Zoom Out');

        //Status
        var statusGroup = group.addFolder("Status");
        statusGroup.open();

        //Time Change this.time directly
        this.time = "0s";
        statusGroup.add(this,'time').name('Game Time').listen();

        //Score Change this.score directly
        this.score = "Red 0 - 0 Blue";
        statusGroup.add(this,'score').name('Score').listen();

        //TODO Winner Change this.winner directly
        this.winner = "Playing...";
        statusGroup.add(this,'winner').name('Winner').listen();

        //TODO Movie will only be available at game end
        this.movie = this.callMovie;
        statusGroup.add(this, 'movie').name('Movie');

    }

    callZoomIn(){
        this.board.zoom(-5);
    }

    callZoomOut(){
        this.board.zoom(5);
    }

    callMovie() {
        this.board.movie();
    }

    callNewGame() {
        this.board.newGame();
    }

    callUndo() {
        if(!this.undoBlocked)
            this.board.undo();
    }

    //Process mouse down
    processMouseDown(event) {

        if (this.playerBlock)
            return;

        this.mouse[0] = event.pageX;
        this.mouse[1] = event.pageY;

        //Click Down
        var result = this.board.raycast.process("pieces");
        if (result != false) {
            //Is next player piece
            if (this.board.nextPlayer == result.player) {
                //Check if piece is placed already
                if (!result.blocked) {
                    this.held = 1;
                    this.selectedPiece = result;
                    console.log(result);
                } else
                    console.log("This piece is already placed");
            }
            else
                console.log("Not this player turn");
        }
        else
            console.log("No piece selected");

    }

    //Process mouse up
    processMouseUp(event) {

        if (this.playerBlock)
            return;

        this.mouse[0] = event.pageX;
        this.mouse[1] = event.pageY;

        //Piece was being held
        if (this.held == 1) {
            var result = this.board.raycast.process("places");
            if (result != false) {
                console.log(result);
                //Tell board to send a request
                this.board.setPiecePlayer(result.i, result.j, this.selectedPiece, result);
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

        if (this.playerBlock)
            return;

        this.mouse[0] = event.pageX;
        this.mouse[1] = event.pageY;

        //Held down
        if (this.held == 1) {
            var mousePos = this.board.raycast.process("plane");
            this.selectedPiece.hover(mousePos);
        }

    }

}