
class Tile extends CGFobject {
    constructor(scene, board) {
        super(scene);

        this.scene = scene;
        this.board = board;

        //Size
        this.size = 1;

        //Tile
        this.tile = new Plane(scene, 20, 20);

        //Setup material
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);

        //Position
        this.x = 0;
        this.z = 0;

        //Board index
        this.i = 0;
        this.j = 0;

    };

    display() {

        //Display
        this.scene.pushMatrix();

        //Coordinate offset
        this.scene.translate(this.x, 0, this.z);

        //Flip to vertically
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        //Use hardcoded tile texture
        if (this.scene.graph.loadedTextures.length >= 2)
            this.appearance.setTexture(this.scene.graph.loadedTextures[0].tex);
        this.appearance.apply();
        this.tile.display();

        this.scene.popMatrix();

    }

    //Raycast callback
    hit() {
        this.board.tileHit(this);
    }

};