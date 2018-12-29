
class Board extends CGFobject {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        //TODO Hardcoded size
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
        this.matrix = [];
        for (var i = 0; i < this.size; i++)
            this.matrix[i] = new Array(this.size);

        //Tile
        this.tile = new Plane(scene, 20, 20);

        //Piece
        this.piece = new Piece(scene);

    };

    display() {

        //TODO raycast processing will be called on mouse press/held/released
        this.raycast.process(this.scene, this.scene.camera);

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

        //TODO Display pieces
        this.piece.display();
    }

}