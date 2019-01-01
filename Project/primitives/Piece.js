
class Piece extends CGFobject {
    constructor(scene, board) {
        super(scene);
        
        this.scene = scene;
        this.board = board;

        //Height
        this.height = 0.25;

        //Radius
        this.radius = 0.75;

        //Setup sides
        this.side1 = new Cylinder(scene, this.radius, this.radius, this.height, 20, 20);
        this.side2 = new Cylinder(scene, this.radius, this.radius, -this.height, 20, 20);

        //Setup material
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);

        //Player
        this.player = 0;

        //Position
        this.x = 0;
        this.z = 0;

    };

    display() {

        //Display
        this.scene.pushMatrix();

        this.scene.translate(this.x, 0, this.z);
        this.scene.translate(0, this.height, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        //Flip for player
        if (this.player)
            this.scene.rotate(Math.PI, 1, 0, 0);

        //Use hardcoded player texture
        if (this.scene.graph.loadedTextures.length >= 2)
            this.appearance.setTexture(this.scene.graph.loadedTextures[1].tex);
        this.appearance.apply();
        this.side1.display();

        //Use hardcoded player texture
        if (this.scene.graph.loadedTextures.length >= 2)
            this.appearance.setTexture(this.scene.graph.loadedTextures[2].tex);
        this.appearance.apply();
        this.side2.display();

        this.scene.popMatrix();

    }

    //Raycast callback
    hit(){
        this.board.pieceHit(this);
    }

};