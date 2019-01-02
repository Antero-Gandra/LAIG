
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
        this.side2 = new Cylinder(scene, this.radius, this.radius, this.height, 20, 20);

        //Setup hover effect
        this.hoverObj = new Cylinder(scene, 0.1, 0.1, 5, 4, 4);

        //Setup player 1 material
        this.appearanceP1 = new CGFappearance(this.scene);
        this.appearanceP1.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearanceP1.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearanceP1.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearanceP1.setShininess(120);

        //Setup player 2 material
        this.appearanceP2 = new CGFappearance(this.scene);
        this.appearanceP2.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearanceP2.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearanceP2.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearanceP2.setShininess(120);

        //Setup hover material
        this.appearanceH = new CGFappearance(this.scene);
        this.appearanceH.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearanceH.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearanceH.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearanceH.setShininess(120);

        //Player
        // 0 -> Player 1
        // 1 -> Player 2
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
            this.scene.translate(-hoverOffset[0], 5, -hoverOffset[2] + this.radius / 4);

        }

        //Surface
        this.scene.translate(0, this.height, 0);

        //Flip to vertically
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        //Flip for player
        if (this.player) {
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.scene.translate(0, 0, -this.height);
        }
        else {
            this.scene.translate(0, 0, -this.height);
        }

        //Use hardcoded player texture
        if (this.appearanceP1.texture == null)
            if (this.scene.graph.loadedTextures.length >= 1)
                this.appearanceP1.setTexture(this.scene.graph.loadedTextures[1].tex);
        this.appearanceP1.apply();
        this.side1.display();

        //Use hardcoded player texture
        if (this.appearanceP2.texture == null)
            if (this.scene.graph.loadedTextures.length >= 1)
                this.appearanceP2.setTexture(this.scene.graph.loadedTextures[2].tex);
        this.appearanceP2.apply();
        this.scene.translate(0, 0, this.height);
        this.side2.display();

        //Hover flip for the hover effect
        if (this.hovering) {

            //Flip for player
            if (!this.player)
                this.scene.rotate(Math.PI, 1, 0, 0);

            //Use hardcoded hover texture
            if (this.appearanceH.texture == null)
                if (this.scene.graph.loadedTextures.length >= 1)
                    this.appearanceH.setTexture(this.scene.graph.loadedTextures[3].tex);

            //Display hover
            this.appearanceH.apply();
            this.hoverObj.display();
        }

        this.scene.popMatrix();

    }

    getPlayer() {
        switch (this.player) {
            case 0:
                return 'o';
            case 1:
                return 'x';
            default:
                break;
        }
    }

    //Raycast callback
    hit() {
        this.board.pieceHit(this);
    }

    //Use hovering
    hover(pos) {
        this.hovering = true;
        this.hoverPos = pos;
    }

    //Disable hovering
    unhover() {
        this.hovering = false;
    }

};