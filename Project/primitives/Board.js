
class Board extends CGFobject {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        //Board size (Even numbers work, not odd)
        this.size = 8;

        //Setup raycast
        this.raycast = new Raycast(null, null, null);

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
                    player: 0,
                    piece: null
                }
        }

        //Tile
        this.tile = new Plane(scene, 20, 20);

        //Piece
        this.pieces = [];
        for (var i = 0; i < this.size * this.size; i++)
            this.pieces[i] = new Piece(scene);

        //Piece Size
        this.pieceSize = 2;

        //Positioning player 1
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size / 2; j++) {
                //Offset to place center
                this.pieces[i + this.size * j].x -= this.pieceSize/2;
                this.pieces[i + this.size * j].z -= this.pieceSize/2;
                //Position line
                this.pieces[i + this.size * j].x -= this.pieceSize * (this.size / this.pieceSize + this.pieceSize/2 + j);
                this.pieces[i + this.size * j].z -= this.pieceSize * (this.size / this.pieceSize - this.pieceSize/2);
                //Line offset
                this.pieces[i + this.size * j].z += this.pieceSize * i;
            }
        }

        //Positioning player 2
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size / 2; j++) {
                //Offset to place center
                this.pieces[this.size * this.size / 2 + i + this.size * j].x += this.pieceSize/2;
                this.pieces[this.size * this.size / 2 + i + this.size * j].z += this.pieceSize/2;
                //Position line
                this.pieces[this.size * this.size / 2 + i + this.size * j].x += this.pieceSize * (this.size / this.pieceSize + this.pieceSize/2 + j);
                this.pieces[this.size * this.size / 2 + i + this.size * j].z -= this.pieceSize * this.size / this.pieceSize;
                //Line offset
                this.pieces[this.size * this.size / 2 + i + this.size * j].z += this.pieceSize * i;
                //Flip for player 2
                this.pieces[this.size * this.size / 2 + i + this.size * j].player = this.pieceSize/2;
            }
        }

    };

    display() {

        //Use hardcoded tile texture
        if (this.appearance.texture == null) {
            if (this.scene.graph.loadedTextures.length >= 2)
                this.appearance.setTexture(this.scene.graph.loadedTextures[0].tex);
        }
        this.appearance.apply();

        //Display Tiles
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-2 * this.size / 2 - 1, 2 * this.size / 2 - 1, 0);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.scene.translate(2, 0, 0);
                this.tile.display();
            }
            this.scene.translate(-2 * this.size, -2, 0);
        }
        this.scene.popMatrix();

        //Display pieces
        for (var i = 0; i < this.size * this.size; i++)
            this.pieces[i].display();

        //this.makeRequest();

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

    makeRequest() {
        var requestString = "quit";
        
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

        this.getPrologRequest(requestString, this.handleReply);
    }

    handleReply(data) {
        console.log("Reply: " + data);
    }

}