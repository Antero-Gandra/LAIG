
/*
    Performs raycasts from the eye position to a list of colliders
*/

class Raycast {

    /**
     * @constructor
     * colliders are references to collider variable of board plates or pieces
     */
    constructor(camera, colliders) {
        this.eyePos = camera.position;
        this.eyeDir = camera.direction;
        this.colliders = colliders;
    }

    /*
        Updates points to be raycasted
        Should be called when board changes position
        Might not be necessary if the board doesn't change position and the scenario changes around it
    */
    updateColliders(nColliders){
        this.colliders = nColliders;
    }

    /*
        TODO
        Returns collider and triggers a callback
    */
    collisionResult(mousePos){

    }

}