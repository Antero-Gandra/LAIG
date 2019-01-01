
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

        //Setup hover effect
        this.hoverObj = new Cylinder(scene, 0.1, 0.1, 5, 4, 4);

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

        //Setup
        this.hovering = false;

    };

    getTranslation(out, mat) {
        out[0] = mat[12];
        out[1] = mat[13];
        out[2] = mat[14];
        return out;
    }

    display() {

        //Display
        this.scene.pushMatrix();

        //Coordinate offset
        this.scene.translate(this.x, 0, this.z);

        //Hover offset
        if (this.hovering) {

            //Get original position
            var pos = vec3.fromValues(this.x, 0, this.z);

            //Offset to hover pos
            var hoverOffset = vec3.create();
            vec3.subtract(hoverOffset, pos, this.hoverPos);

            //Apply offse to matrix
            this.scene.translate(-hoverOffset[0], 5, -hoverOffset[2]);

        }

        //Surface
        this.scene.translate(0, this.height, 0);

        //Flip to vertically
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

        //Hover flip for the hover effect
        if (this.hovering) {

            //Flip for player
            if (!this.player)
                this.scene.rotate(Math.PI, 1, 0, 0);
            
            //Use hardcoded hover texture
            if (this.scene.graph.loadedTextures.length >= 2)
                this.appearance.setTexture(this.scene.graph.loadedTextures[3].tex);

            //Display hover
            this.appearance.apply();
            this.hoverObj.display();
        }

        this.scene.popMatrix();

    }

    //Raycast callback
    hit() {
        this.board.pieceHit(this);
    }

    hover(pos) {
        this.hovering = true;
        this.hoverPos = pos;
    }

    unhover() {
        this.hovering = false;
    }

};