
class Board extends CGFobject {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        //Board size (Even numbers work, not odd)
        this.size = 8;

        //Setup material
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);

        //Data
        this.matrix = [];
        for (var i = 0; i < this.size; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < this.size; j++)
                this.matrix[i][j] = {
                    // 0 -> Empty
                    // 1 -> Player 1
                    // 2 -> Player 2
                    player: 0,
                    piece: null
                }
        }

        //Piece Size
        this.pieceSize = 2;

        //Tiles
        this.tiles = [];
        for (var i = 0; i < this.size * this.size; i++)
            this.tiles[i] = new Tile(scene, this);

        //Position tiles
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                //Offset to place center
                this.tiles[i + this.size * j].x -= this.pieceSize / 2 + this.pieceSize * (this.size / 2 - 1);
                this.tiles[i + this.size * j].z -= this.pieceSize / 2 + this.pieceSize * (this.size / 2 - 1);
                //Offset Matrix
                this.tiles[i + this.size * j].x += this.pieceSize * i;
                this.tiles[i + this.size * j].z += this.pieceSize * j;
                //Board Position
                this.tiles[i + this.size * j].i = i + 1;
                this.tiles[i + this.size * j].j = j + 1;
            }
        }

        //Pieces
        this.pieces = [];
        for (var i = 0; i < this.size * this.size; i++)
            this.pieces[i] = new Piece(scene, this);


        //Positioning player 1
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size / 2; j++) {
                //Offset to place center
                this.pieces[i + this.size * j].x -= this.pieceSize / 2;
                this.pieces[i + this.size * j].z -= this.pieceSize / 2;
                //Position line
                this.pieces[i + this.size * j].x -= this.pieceSize * (this.size / this.pieceSize + this.pieceSize / 2 + j);
                this.pieces[i + this.size * j].z -= this.pieceSize * (this.size / this.pieceSize - this.pieceSize / 2);
                //Line offset
                this.pieces[i + this.size * j].z += this.pieceSize * i;
            }
        }

        //Positioning player 2
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size / 2; j++) {
                //Offset to place center
                this.pieces[this.size * this.size / 2 + i + this.size * j].x += this.pieceSize / 2;
                this.pieces[this.size * this.size / 2 + i + this.size * j].z += this.pieceSize / 2;
                //Position line
                this.pieces[this.size * this.size / 2 + i + this.size * j].x += this.pieceSize * (this.size / this.pieceSize + this.pieceSize / 2 + j);
                this.pieces[this.size * this.size / 2 + i + this.size * j].z -= this.pieceSize * this.size / this.pieceSize;
                //Line offset
                this.pieces[this.size * this.size / 2 + i + this.size * j].z += this.pieceSize * i;
                //Flip for player 2
                this.pieces[this.size * this.size / 2 + i + this.size * j].player = 1;
            }
        }

        //Setup raycast
        this.raycast = new Raycast(this.scene, this.pieces, this.tiles, vec3.fromValues(0, 0, 0), 1);

        //Setup player order
        this.nextPlayer = 1;

        //Default Settings
        this.difficulty = "Easy";
        this.mode = "Player vs Player";

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
        if(this.rotatingCamera)
            this.rotatingAnimation();

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
            if(this.nextPlayer == 1)
                phase += Math.PI;

            //Rotate camera around center
            var x = Math.cos(phase) * this.cameraHorizontalRadius;
            var y = Math.sin(phase) * this.cameraHorizontalRadius;
            this.scene.camera.position[0] = x;
            this.scene.camera.position[2] = y;

        } else {
            
            //Latch camera to position
            if(this.nextPlayer == 0){
                this.scene.camera.position[0] = -this.cameraHorizontalRadius;
                this.scene.camera.position[2] = 0;
            }else{
                this.scene.camera.position[0] = this.cameraHorizontalRadius;
                this.scene.camera.position[2] = 0;
            }

            this.rotatingCamera = false;
            this.raycast.prepare();
        }

    }

    //Returns the current score
    score() {

        var score = {
            p1: 0,
            p2: 0
        }

        //Check each piece
        for (let i = 0; i < this.pieces.length; i++) {
            //If it was blocked then it is placed
            if (this.pieces[i].blocked) {
                //Player 1
                if (this.pieces[i].player == 0)
                    score.p1++;
                //Player 2
                if (this.pieces[i].player == 1)
                    score.p2++;
            }
        }

        return score;

    }

    pieceHit(piece) {

    }

    tileHit(piece) {

    }

    //Returns the board in a string format to be argument for prolog
    formatBoard() {

        var string = "[[";
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {

                //Piece
                switch (this.matrix[i][j].player) {
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
                if (j != this.matrix[i].length - 1)
                    string += ",";

            }

            //Marker between rows
            if (i != this.matrix.length - 1)
                string += "],[";

        }

        //Final Marker
        string += "]]";

        return string;

    }

    //Prepares and sends Prolog Request to place piece
    setPiecePlayer(i, j, piece, tile) {

        //Check if tile is empty(Prolog doesn't)
        if (this.matrix[i - 1][j - 1].player == 0) {

            //Send Prolog Request
            this.makeRequest("setPeca(" + i + "," + j + ",'" + piece.getPlayer() + "'," + this.formatBoard() + ")");

            //Update Piece Position
            piece.x = tile.x;
            piece.z = tile.z;

            //Set piece on matrix
            this.matrix[i - 1][j - 1].piece = piece;

            //Piece can't be used anymore
            piece.blocked = true;

            //Next player
            this.nextPlayer = !this.nextPlayer;

            //Check mode
            if(this.mode == "Player vs Player"){
                //Rotate Camera
                this.rotateCamera();
            }   

        }

    }

    //Set CPU piece from Prolog response
    setPieceCPU(data){

        //Get available piece
        var piece;
        for (let i = 0; i < this.pieces.length; i++) {
            if(!this.pieces[i].blocked && this.pieces[i].player == this.nextPlayer){
                piece = this.pieces[i];
                break;
            }
        }

        var boardIndex = data.indexOf("]-");

        //Get board coordinates
        var board = data.substr(1, boardIndex);

        //Get piece coordinates
        var matI = data.substr(boardIndex+2, 1);
        var matJ = data.substr(boardIndex+4, 1);
        console.log(data);
        console.log(matI);
        console.log(matJ);

        //Set piece on matrix
        this.matrix[matI-1][matJ-1].piece = piece;

        //Update Piece Position
        //TODO Needs to be in animation(Animation probably needs to block updateBoard or it will look out of sync)
        for (let i = 0; i < this.tiles.length; i++) {
            if(this.tiles[i].i == matI && this.tiles[i].j == matJ){
                piece.x = this.tiles[i].x;
                piece.z = this.tiles[i].z;
                break;
            }
        }

        //Piece can't be used anymore
        piece.blocked = true;

        //Swap Player
        this.nextPlayer = !this.nextPlayer;

        //Update board
        this.updateBoard(board);
    }

    //Updates Board from Prolog response data
    updateBoard(string) {

        var i = 0;

        for (let j = 0; j < string.length; j++) {
            let c = string[j];

            var x = Math.floor(i / this.size);
            var y = Math.floor(i % this.size);

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
                    this.matrix[x][y].player = 0;
                    this.matrix[x][y].piece = null;
                    i++;
                    break;
                case 'x':
                    //TODO If piece is present then tell it to flip(visually and player)
                    if (this.matrix[x][y].player == 2) {
                        console.log("Flip piece");
                        this.matrix[x][y].piece.flip();
                    }
                    //Update matrix
                    this.matrix[x][y].player = 1;
                    i++;
                    break;
                case 'o':
                    //TODO If piece is present then tell it to flip(visually and player)
                    if (this.matrix[x][y].player == 1) {
                        console.log("Flip piece");
                        this.matrix[x][y].piece.flip();
                    }
                    //Update matrix
                    this.matrix[x][y].player = 2;
                    i++;
                    break;
                default:
                    break;
            }
        }

        //Ready for a CPU play on "Player vs CPU"
        if(this.mode == "Player vs CPU" && this.nextPlayer == 0){
            //TODO use difficulty mode
            this.makeRequest("jogaPCEasy(" + this.formatBoard() + ")");
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

    //TODO Needs to differentiate when it receives boards or a end game check, probably just look at string
    onSuccess(data) {

        //Response type is board after CPU play
        if(data.target.response[data.target.response.length-2] != ']'){
            this.board.setPieceCPU(data.target.response);
        }
        //Response type is board after player play
        else if (data.target.response[0] == '[') {
            this.board.updateBoard(data.target.response);
        }

    }

}