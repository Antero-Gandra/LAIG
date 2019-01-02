
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
        //TODO piece must be set when a piece is placed in that location
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

    };

    display() {

        //Display Tiles
        for (let i = 0; i < this.size * this.size; i++) {
            this.tiles[i].display();
        }

        //Display pieces
        for (var i = 0; i < this.size * this.size; i++)
            this.pieces[i].display();

        //TODO Requests will be made in callback functions of Board, called from Mouse events
        //this.makeRequest();

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

    //Prepares and sends Prolog Request
    //TODO will keep track of who is next player, needs to block move from same player somewhere, either here or in the interface(more visually logic)
    setPiece(i, j, piece) {
        this.makeRequest("setPeca(" + i + "," + j + ",'" + piece.getPlayer() + "'," + this.formatBoard() + ")");
    }

    //Prolog Server Example

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
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

        this.getPrologRequest(string, this.handleReply);
    }

    //TODO Needs to differentiate when it receives boards or a end game check, probably just look at string
    handleReply(data) {
        console.log("Reply: " + data.target.response);
    }

}