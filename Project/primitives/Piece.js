
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

        //Setup shadow
        this.shadow = new Circle(scene, 20);

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

        //Setup shadow material
        this.appearanceS = new CGFappearance(this.scene);
        this.appearanceS.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearanceS.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearanceS.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearanceS.setShininess(120);

        //Player
        // 0 -> Player 1
        // 1 -> Player 2
        this.player = 0;

        //Position
        this.x = 0;
        this.z = 0;

        //Setup
        this.hovering = false;
        this.blocked = false;
        this.heightAnim = 0;
        this.hoverPos = vec3.create();
        this.hoverHeight = 5;
        this.noShadow = false;

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

        //Reset animation
        if (this.reseting)
            this.resetAnimation();

        //CPU Throw animation
        if (this.throwing && !this.reseting)
            this.throwAnimation();

        //Undo Animation
        if(this.undoing)
            this.undoAnimation();

        //Coordinate offset
        this.scene.translate(this.x, 0, this.z);

        //Capture Flip animation
        if (this.flipping)
            this.flipAnimation();

        //Hover offset
        if (this.hovering) {

            //Get original position
            var pos = vec3.fromValues(this.x, 0, this.z);

            //Offset to hover pos
            var hoverOffset = vec3.create();
            vec3.subtract(hoverOffset, pos, this.hoverPos);

            //Apply offse to matrix
            this.scene.translate(-hoverOffset[0], this.hoverHeight, -hoverOffset[2] + this.radius / 4);

        }

        //Display shadow
        if (!this.blocked && !this.noShadow)
            this.displayShadow();

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

        this.scene.popMatrix();

    }

    displayShadow() {
        //Display Shadow
        this.scene.pushMatrix();

        if (this.appearanceS.texture == null)
            if (this.scene.graph.loadedTextures.length >= 1)
                this.appearanceS.setTexture(this.scene.graph.loadedTextures[3].tex);
        this.appearanceS.apply();

        //Coordinate offset
        if (this.hovering)
            this.scene.translate(0, 0.02 - this.hoverHeight, 0);
        this.scene.translate(0, 0.02 - this.heightAnim, 0);
        this.scene.scale(0.75, 1, 0.75);

        //Flip to vertically
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        this.shadow.display();

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

    //Reset
    reset() {

        //All pieces should stop throw
        this.throwing = false;
        this.heightAnim = 0;
        this.throwStart = 0;

        if(!this.blocked)
            return;

        this.reseting = true;
        this.resetStart = new Date().getTime() / 1000;
        this.board.scene.interface.undoBlocked = true;
    }

    //Reset Animation
    resetAnimation() {

        //Timings
        var currentTime = new Date().getTime() / 1000;
        var diff = currentTime - this.resetStart;
        var animTime = 1;

        //Distance
        var distanceX = this.originalX - this.x;
        var distanceZ = this.originalZ - this.z;
        var height = 10;

        //Animation
        if (diff < animTime) {
            var trans = diff;
            if (diff > animTime / 2)
                trans = animTime - diff;
            this.heightAnim = trans * height;
            this.scene.translate(diff * distanceX, trans * height, diff * distanceZ);
            //Animation Done
        } else {
            this.blocked = false;
            this.reseting = false;
            //Player
            this.player = this.originalPlayer;
            //Height of animation reset
            this.heightAnim = 0;
            //Original
            this.x = this.originalX;
            this.z = this.originalZ;   
            this.board.scene.interface.undoBlocked = false;       
        }
    }

    //CPU Throw
    throw(boardData, tile) {
        this.throwing = true;
        this.throwStart = new Date().getTime() / 1000;
        this.board.scene.interface.undoBlocked = true;

        //Info to use after animation is done
        this.throwTarget = tile;
        this.boardData = boardData;
    }

    //CPU Throw Animation
    throwAnimation() {

        //Timings
        var currentTime = new Date().getTime() / 1000;
        var diff = currentTime - this.throwStart;
        var animTime = 1;

        //Distance
        var distanceX = this.throwTarget.x - this.x;
        var distanceZ = this.throwTarget.z - this.z;
        var height = 10;

        //Animation
        if (diff < animTime) {
            var trans = diff;
            if (diff > animTime / 2)
                trans = animTime - diff;
            this.heightAnim = trans * height;
            this.scene.translate(diff * distanceX, trans * height, diff * distanceZ);
            //Animation Done
        } else {
            this.throwing = false;
            //Position
            this.x = this.throwTarget.x;
            this.z = this.throwTarget.z;
            //Piece can't be used anymore
            this.blocked = true;
            //Swap Player
            this.board.nextPlayer = !this.board.nextPlayer;
            //Update board
            this.board.updateBoard(this.boardData);
            this.board.scene.interface.undoBlocked = false;
        }
    }

    //Undo Throw
    undo() {
        this.undoing = true;
        this.blocked = false;
        this.board.scene.interface.undoBlocked = true;
        this.undoStart = new Date().getTime() / 1000;
    }

    //Undo Animation
    undoAnimation() {

        //Timings
        var currentTime = new Date().getTime() / 1000;
        var diff = currentTime - this.undoStart;
        var animTime = 1;

        //Distance
        var distanceX = this.originalX - this.x;
        var distanceZ = this.originalZ - this.z;
        var height = 10;

        //Animation
        if (diff < animTime) {
            var trans = diff;
            if (diff > animTime / 2)
                trans = animTime - diff;
            this.heightAnim = trans * height;
            this.scene.translate(diff * distanceX, trans * height, diff * distanceZ);
            //Animation Done
        } else {
            this.undoing = false;
            //Position
            this.x = this.originalX;
            this.z = this.originalZ;
            //Piece can't be used anymore
            this.heightAnim = 0;
            this.board.scene.interface.undoBlocked = false;
        }
    }

    //Flip piece
    flip(flips = 4) {
        this.flips = flips;
        this.flipping = true;
        this.flipStart = new Date().getTime() / 1000;
        this.board.scene.interface.undoBlocked = true;
    }

    //Flip animation
    flipAnimation() {

        //Timings
        var currentTime = new Date().getTime() / 1000;
        var diff = currentTime - this.flipStart;
        var animTime = 1;

        //Settings
        var animScale = 10;

        //Animation
        if (diff < animTime) {
            var trans = diff;
            if (diff > animTime / 2)
                trans = animTime - diff;
            this.scene.translate(0, trans * animScale, 0);
            //Compensate height
            this.scene.translate(0, this.height, 0);
            //Rotation
            this.scene.rotate(diff * Math.PI * (1 + this.flips) / animTime, 1, 0, 0);
            //Animation Done
        } else {
            this.flipping = false;
            this.player = !this.player;
            this.board.scene.interface.undoBlocked = false;
        }

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