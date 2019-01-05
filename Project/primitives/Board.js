
class Board extends CGFobject {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        //Board size (Even numbers work, not odd)
        this.size = 8;

        //Piece Size
        this.pieceSize = 2;

        //Stack of boards
        this.matrixStack = [];

        //Stack of flipped
        this.flipped = [];

        //Stack of movements
        this.movements = [];

        //Data
        this.currentMatrix = [];
        for (var i = 0; i < this.size; i++) {
            this.currentMatrix[i] = [];
            for (var j = 0; j < this.size; j++)
                this.currentMatrix[i][j] = {
                    // 0 -> Empty
                    // 1 -> Player 1
                    // 2 -> Player 2
                    player: 0,
                    piece: null
                }
        }

        //Tiles
        this.tiles = [];
        for (var i = 0; i < this.size * this.size; i++)
            this.tiles[i] = new Tile(this.scene, this);

        //Position tiles
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let index = i + this.size * j;
                //Offset to place center
                this.tiles[index].x -= this.pieceSize / 2 + this.pieceSize * (this.size / 2 - 1);
                this.tiles[index].z -= this.pieceSize / 2 + this.pieceSize * (this.size / 2 - 1);
                //Offset Matrix
                this.tiles[index].x += this.pieceSize * i;
                this.tiles[index].z += this.pieceSize * j;
                //Board Position
                this.tiles[index].i = i + 1;
                this.tiles[index].j = j + 1;
            }
        }

        //Pieces
        this.pieces = [];
        for (var i = 0; i < this.size * this.size; i++)
            this.pieces[i] = new Piece(this.scene, this);


        //Positioning player 1
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size / 2; j++) {
                let index = i + this.size * j;
                //Offset to place center
                this.pieces[index].x -= this.pieceSize / 2;
                this.pieces[index].z -= this.pieceSize / 2;
                //Position line
                this.pieces[index].x -= this.pieceSize * (this.size / this.pieceSize + this.pieceSize / 2 + j);
                this.pieces[index].z -= this.pieceSize * (this.size / this.pieceSize - this.pieceSize / 2);
                //Line offset
                this.pieces[index].z += this.pieceSize * i;
                //Originals
                this.pieces[index].originalX = this.pieces[index].x;
                this.pieces[index].originalZ = this.pieces[index].z;
                this.pieces[index].originalPlayer = 0;
            }
        }

        //Positioning player 2
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size / 2; j++) {
                let index = this.size * this.size / 2 + i + this.size * j;
                //Offset to place center
                this.pieces[index].x += this.pieceSize / 2;
                this.pieces[index].z += this.pieceSize / 2;
                //Position line
                this.pieces[index].x += this.pieceSize * (this.size / this.pieceSize + this.pieceSize / 2 + j);
                this.pieces[index].z -= this.pieceSize * this.size / this.pieceSize;
                //Line offset
                this.pieces[index].z += this.pieceSize * i;
                //Flip for player 2
                this.pieces[index].player = 1;
                //Originals
                this.pieces[index].originalX = this.pieces[index].x;
                this.pieces[index].originalZ = this.pieces[index].z;
                this.pieces[index].originalPlayer = 1;
            }
        }

        //Setup material
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);

        //Setup player order
        this.nextPlayer = 1;

        //Setup raycast
        this.raycast = new Raycast(this.scene, this.pieces, this.tiles, vec3.fromValues(0, 0, 0), 1);

        this.lastUndone = false;

        //Default Settings
        this.tmpDifficulty = "Easy";
        this.tmpMode = "Player vs Player";
        this.difficulty = "Easy";
        this.mode = "Player vs Player";
        this.startTime = new Date().getTime() / 1000;
        this.ended = false;
        this.readies = 0;
        this.movieReadies = 0;
        this.movieSlide = 0;
        this.playingMovie = false;

    };

    display() {

        //Display Tiles
        for (let i = 0; i < this.size * this.size; i++) {
            this.tiles[i].display();
        }

        //Display pieces
        for (var i = 0; i < this.size * this.size; i++)
            this.pieces[i].display();

        //Rotate Camera
        if (this.rotatingCamera)
            this.rotatingAnimation();

        //Game time
        if (!this.ended) {
            let diff = new Date().getTime() / 1000 - this.startTime;
            diff = diff.toFixed(2);
            this.scene.interface.time = diff.toString() + "s";
        }

    }

    //Zoom camera
    zoom(scale) {

        //Zoom
        var dir = this.scene.camera.calculateDirection();

        var reverse = vec4.create();
        vec4.negate(reverse, dir);

        var zoomVec = vec4.create();
        vec4.scale(zoomVec, reverse, scale);

        vec4.add(this.scene.camera.position, zoomVec, this.scene.camera.position);

        //Update camera radius for animation
        this.cameraHorizontalRadius = Math.abs(this.scene.camera.position[0]);

        //Update Raycast
        this.raycast.prepare();
    }

    getCharPlayer(number) {
        switch (number) {
            case 0:
                return "'v'";
            case 1:
                return "'x'";
            case 2:
                return "'o'";

            default:
                break;
        }
    }

    //Called by each piece to signal they are ready, once all ready we can call movie chain
    movieReady() {

        this.movieReadies++;

        //When all ready start movie
        if (this.movieReadies == this.pieces.length) {
            this.movieReadies = 0;
            this.startMovie();
        }

    }

    //Start movie chain, called once all pieces are in original position and ready
    startMovie() {

        console.log("Start Movie");
        console.log("Play " + (this.movieSlide + 1));

        //First play
        this.movieMovements[this.movieSlide].piece.play(this.movieMovements[this.movieSlide].x, this.movieMovements[this.movieSlide].z);
        this.movieSlide++;

    }

    //Next play of movie, called in end of animation of play
    nextPlay() {

        //Flips
        for (let i = 0; i < this.flipped[this.movieSlide - 1].length; i++) {
            this.flipped[this.movieSlide - 1][i].flip();
        }

        //Check end of movie
        if (this.movieSlide > this.movieMovements.length - 1) {
            this.playingMovie = false;
            this.scene.interface.playerBlock = false;
            this.updateWinner();
            console.log("Movie Ended");
            return;
        }

        console.log("Play " + (this.movieSlide + 1));

        //Next play
        this.movieMovements[this.movieSlide].piece.play(this.movieMovements[this.movieSlide].x, this.movieMovements[this.movieSlide].z);
        this.movieSlide++;

    }

    //Play movie of game
    movie() {

        //Block input while playing movie
        this.scene.interface.playerBlock = true;

        //Signal playing movie
        this.scene.interface.winner = "Playing Movie...";

        //Playing movie
        this.playingMovie = true;

        //Movie slide restart
        this.movieSlide = 0;

        //Store movements
        this.movieMovements = [];

        for (let i = 0; i < this.movements.length; i++) {
            let movieMov = {
                x: this.movements[i].x,
                z: this.movements[i].z,
                piece: this.movements[i]
            }
            this.movieMovements.push(movieMov);
        }

        //Position all pieces at start
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].reset();
        }

    }

    //Update winner UI
    updateWinner(){
        //Get final score
        let score = this.score();

        //Update UI with winner
        if (this.mode == "CPU vs CPU")
            if (score.p1 > score.p2)
                this.scene.interface.winner = "Blue";
            else
                this.scene.interface.winner = "Red";
        else
            if (score.p1 > score.p2)
                this.scene.interface.winner = "Red";
            else
                this.scene.interface.winner = "Blue";

        //If one piece available then still playing
        for (let index = 0; index < this.pieces.length; index++) {
            if(!this.pieces[index].blocked){
                this.scene.interface.winner = "Playing...";
                return;
            }
        }

    }

    //End game, check winner and stop everything
    end() {

        this.ended = true;

        console.log("Game End");

        this.updateWinner();

    }

    //Undo last play or last 2 in case of Player vs CPU
    undo() {

        //Can only undo once
        if (this.lastUndone) {
            return;
        }
        this.lastUndone = true;

        //Wont work in CPU vs CPU
        if (this.mode == "CPU vs CPU")
            return;

        //Only undo if available
        if (this.matrixStack.length > 0) {

            //Double undo for Player vs CPU
            if (this.mode == "Player vs CPU") {

                //Undo matrix
                this.matrixStack.pop();
                if (this.matrixStack.length != 0) {
                    this.currentMatrix = this.matrixStack[this.matrixStack.length - 1];
                }

                //Undo flipped
                let flipped = this.flipped.pop();
                for (let i = 0; i < flipped.length; i++) {
                    flipped[i].flip();
                }

                //Undo player
                this.nextPlayer = !this.nextPlayer

                //Reset last piece movement
                this.movements.pop().undo();
            }

            //Undo matrix
            this.matrixStack.pop();
            if (this.matrixStack.length != 0) {
                this.currentMatrix = this.matrixStack[this.matrixStack.length - 1];
            } else {
                this.refreshMatrix();
            }

            //Undo flipped
            let flipped = this.flipped.pop();
            for (let i = 0; i < flipped.length; i++) {
                flipped[i].flip();
            }

            //Undo player
            this.nextPlayer = !this.nextPlayer

            //Rotate camera back in PvP
            if (this.mode == "Player vs Player")
                this.rotateCamera();

            //Reset last piece movement
            this.movements.pop().undo();

            //Update score after Undo
            this.score();

        }
    }

    //Reset pieces and board data
    resetBoard() {

        //Stack of boards
        this.matrixStack = [];

        //Data
        this.currentMatrix = [];
        for (var i = 0; i < this.size; i++) {
            this.currentMatrix[i] = [];
            for (var j = 0; j < this.size; j++)
                this.currentMatrix[i][j] = {
                    // 0 -> Empty
                    // 1 -> Player 1
                    // 2 -> Player 2
                    player: 0,
                    piece: null
                }
        }

        //Reset pieces
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].reset();
        }

    }

    //Callback used by pieces to say they are ready
    ready() {

        this.readies++;

        //When all ready do full reset
        if (this.readies == this.pieces.length) {
            this.readies = 0;
            this.fullReset();
        }

    }

    //Full reset once all pieces are ready
    fullReset() {

        //Rotate camera for player pieces
        if (!this.nextPlayer && this.mode == "Player vs Player")
            this.rotateCamera();

        this.scene.interface.winner = "Playing...";

        //Activate settings
        this.difficulty = this.tmpDifficulty;
        this.mode = this.tmpMode;

        //Clear play stack
        this.matrixStack = [];
        this.movements = [];
        this.flipped = [];

        this.nextPlayer = 1;

        this.lastUndone = false;

        this.ended = false;

        this.movieAble = false;

        this.playingMovie = false;

        //UI related updates
        this.score();
        this.startTime = new Date().getTime() / 1000;

        //If CPU vs CPU
        if (this.mode == "CPU vs CPU") {

            //Block interface in CPU vs CPU
            this.scene.interface.playerBlock = true;

            //Check difficulty setting and do request
            let string = "";
            if (this.difficulty == "Easy")
                string += "jogaPCEasy(";
            else
                string += "jogaPCHard(";

            string += this.getCharPlayer(this.nextPlayer + 1) + "," + this.formatBoard() + ")";

            this.makeRequest(string);
        }
        else {
            this.scene.interface.playerBlock = false;
        }
    }

    //Create a new game
    newGame() {

        //Dont reset while playing movie
        if (this.playingMovie)
            return;

        //Reset Board
        this.resetBoard();

    }

    //Rotate camera for other player
    rotateCamera() {
        this.rotatingCamera = true;
        this.rotationStart = new Date().getTime() / 1000;
    }

    //Rotate camera animation
    rotatingAnimation() {

        var currentTime = new Date().getTime() / 1000;

        var diff = currentTime - this.rotationStart;

        var animTime = 1;

        if (diff < animTime) {

            //Phase of animation
            var phase = Math.PI * diff / animTime;

            //Modify phase to player
            if (this.nextPlayer == 1)
                phase += Math.PI;

            //Rotate camera around center
            var x = Math.cos(phase) * this.cameraHorizontalRadius;
            var y = Math.sin(phase) * this.cameraHorizontalRadius;
            this.scene.camera.position[0] = x;
            this.scene.camera.position[2] = y;

        } else {

            //Latch camera to position
            if (this.nextPlayer == 0) {
                this.scene.camera.position[0] = -this.cameraHorizontalRadius;
                this.scene.camera.position[2] = 0;
            } else {
                this.scene.camera.position[0] = this.cameraHorizontalRadius;
                this.scene.camera.position[2] = 0;
            }
            this.rotatingCamera = false;

            //Reset Raycast
            this.raycast.prepare();
        }

    }

    //Writes the score in the interface
    score() {

        var score = {
            p1: 0,
            p2: 0
        }

        //Check matrix
        for (let i = 0; i < this.currentMatrix.length; i++) {
            for (let j = 0; j < this.currentMatrix[i].length; j++) {
                //Player 1
                if (this.currentMatrix[i][j].player == 1)
                    score.p1++;
                //Player 2
                if (this.currentMatrix[i][j].player == 2)
                    score.p2++;
            }
        }

        //Update UI
        if (this.mode == "CPU vs CPU")
            this.scene.interface.score = "Red " + score.p2.toString() + " - " + score.p1.toString() + " Blue";
        else
            this.scene.interface.score = "Red " + score.p1.toString() + " - " + score.p2.toString() + " Blue";

        return score;

    }

    //Returns the board in a string format to be argument for prolog
    formatBoard() {

        var string = "[[";
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

                //Piece
                switch (this.currentMatrix[i][j].player) {
                    case 0:
                        string += "'v'";
                        break;
                    case 1:
                        string += "'x'";
                        break;
                    case 2:
                        string += "'o'";
                        break;
                    default:
                        break;
                }

                //Comma between tiles
                if (j != this.currentMatrix[i].length - 1)
                    string += ",";

            }

            //Marker between rows
            if (i != this.currentMatrix.length - 1)
                string += "],[";

        }

        //Final Marker
        string += "]]";

        return string;

    }

    //New matrix for current
    refreshMatrix() {
        //New matrix
        this.currentMatrix = [];
        for (let i = 0; i < this.size; i++) {
            this.currentMatrix[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.currentMatrix[i][j] = {
                    // 0 -> Empty
                    // 1 -> Player 1
                    // 2 -> Player 2
                    player: 0,
                    piece: null
                }
                if (this.matrixStack.length > 0) {
                    this.currentMatrix[i][j].player = this.matrixStack[this.matrixStack.length - 1][i][j].player;
                    if (this.matrixStack[this.matrixStack.length - 1][i][j].piece != null) {
                        this.currentMatrix[i][j].piece = this.matrixStack[this.matrixStack.length - 1][i][j].piece;
                    }
                }
            }
        }
    }

    //Prepares and sends Prolog Request to place piece
    setPiecePlayer(i, j, piece, tile) {

        if (this.matrixStack.length > 0) {
            console.log(this.matrixStack[this.matrixStack.length - 1][7]);
            console.log(this.currentMatrix[7]);
        }

        //Check if tile is empty(Prolog doesn't)
        if (this.currentMatrix[i - 1][j - 1].player == 0) {

            this.lastUndone = false;

            //Register piece moved
            this.movements.push(piece);

            //New matrix
            this.refreshMatrix();

            //Send Prolog Request
            this.makeRequest("setPeca(" + i + "," + j + ",'" + piece.getPlayer() + "'," + this.formatBoard() + ")");

            //Update Piece Position
            piece.x = tile.x;
            piece.z = tile.z;

            //Set piece on matrix
            this.currentMatrix[i - 1][j - 1].piece = piece;

            //Piece can't be used anymore
            piece.blocked = true;

            //Next player
            this.nextPlayer = !this.nextPlayer;

            //Check mode
            if (this.mode == "Player vs Player") {
                //Rotate Camera
                this.rotateCamera();
            }

        }

    }

    //Set CPU piece from Prolog response
    setPieceCPU(data) {

        //Get available piece
        var piece;
        for (let i = 0; i < this.pieces.length; i++) {
            if (!this.pieces[i].blocked && this.pieces[i].player == this.nextPlayer) {
                piece = this.pieces[i];
                break;
            }
        }

        this.movements.push(piece);

        var boardIndex = data.indexOf("]-");

        //Get board coordinates
        var board = data.substr(1, boardIndex);

        //Get piece coordinates
        var matI = data.substr(boardIndex + 2, 1);
        var matJ = data.substr(boardIndex + 4, 1);

        //New matrix
        this.refreshMatrix();

        //Set piece on matrix
        this.currentMatrix[matI - 1][matJ - 1].piece = piece;

        //Update Piece Position
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].i == matI && this.tiles[i].j == matJ) {
                piece.throw(board, this.tiles[i]);
                break;
            }
        }

    }

    //Updates Board from Prolog response data
    updateBoard(string) {

        //Write new matrix
        var i = 0;
        for (let j = 0; j < string.length; j++) {
            let c = string[j];

            let x = Math.floor(i / this.size);
            let y = Math.floor(i % this.size);

            switch (c) {
                //Ignored chars
                case '[':
                    break;
                case ']':
                    break;
                case ',':
                    break;
                //Chars to use
                case 'v':
                    i++;
                    break;
                case 'x':
                    this.currentMatrix[x][y].player = 1;
                    i++;
                    break;
                case 'o':
                    this.currentMatrix[x][y].player = 2;
                    i++;
                    break;
                default:
                    break;
            }
        }

        //Register of flips
        let flipped = [];

        //Check differences to flip
        if (this.matrixStack.length > 0) {
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    if (this.matrixStack[this.matrixStack.length - 1][x][y].player != this.currentMatrix[x][y].player && this.matrixStack[this.matrixStack.length - 1][x][y].player != 0) {
                        console.log("Flip piece");
                        this.currentMatrix[x][y].piece.flip();
                        flipped.push(this.currentMatrix[x][y].piece);
                    }
                }
            }
        }

        //Add to flipped register
        this.flipped.push(flipped);

        //Add to stack
        this.matrixStack.push(this.currentMatrix);

        //Update Score
        this.score();

        //Check game end
        let vacant = false;
        for (let i = 0; i < this.currentMatrix.length; i++) {
            for (let j = 0; j < this.currentMatrix[i].length; j++) {
                if (this.currentMatrix[i][j].player == 0) {
                    vacant = true;
                    break;
                }
            }
        }
        if (!vacant) {
            this.end();
            return;
        }


        //Ready for a CPU play on "Player vs CPU"
        if (this.mode == "Player vs CPU" && this.nextPlayer == 0) {
            //Check difficulty setting and do request
            let string = "";
            if (this.difficulty == "Easy")
                string += "jogaPCEasy(";
            else
                string += "jogaPCHard(";

            string += this.getCharPlayer(this.nextPlayer + 2) + "," + this.formatBoard() + ")";

            this.makeRequest(string);
        }

        //Ready for a CPU play on "CPU vs CPU"
        else if (this.mode == "CPU vs CPU") {
            //Check difficulty setting and do request
            let string = "";
            if (this.difficulty == "Easy")
                string += "jogaPCEasy(";
            else
                string += "jogaPCHard(";

            string += this.getCharPlayer(this.nextPlayer + 1) + "," + this.formatBoard() + ")";

            this.makeRequest(string);
        }

        console.log(string);
    }

    //Prolog Server Example

    getPrologRequest(board, requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();

        //Identify Board
        request.board = board;

        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(string) {

        //Sample messages

        //Send piece
        //setPeca(1,1,'x',[['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v']])

        //Board end
        //verificaFimJogo([['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v']])

        //Winner
        //verificaVencedorJogo([['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v']])

        //Joga PC Easy
        //jogaPCEasy([['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v']])

        //Joga PC Hard
        //jogaPCHard([['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v'],['v','v','v','v','v','v','v','v']])

        this.getPrologRequest(this, string, this.onSuccess);
    }

    //Success responses
    onSuccess(data) {

        //Response type is board after CPU play
        if (data.target.response[data.target.response.length - 2] != ']') {
            this.board.setPieceCPU(data.target.response);
        }
        //Response type is board after player play
        else if (data.target.response[0] == '[') {
            this.board.updateBoard(data.target.response);
        }

    }

}