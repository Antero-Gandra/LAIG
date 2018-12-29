
/*
    Performs raycasts from the eye position to a list of colliders
*/

class Raycast {

    /*
        Workflow of raycasting, from picking to dragging to dropping
        1- Line to collider (sphere) raycasting to every piece to pick the piece we want (Mouse press)
        2- Line to board (plane) raycast to know the position the piece is being dragged at (Mouse held down)
        3- Line to board (plane) raycast to know the position the piece is dropped (Mouse released)
        (Alternatively step 3 can be raycast collision to sphere of board places, so wont need to calculate coordinates upon release)
    */

    /*
    Piece and Place collider structure
    collider = {
        center: {
            x:
            y:
        }
        radius:
        object:
    }
    */

    /*
        Constructor with all the colliders to be used
        pieces - board pieces
        places - board places
        plane - horizontal(XZ) plane (just a Y value)
    */
    constructor(pieces, places, plane) {
        this.pieces = pieces;
        this.places = places;
        this.plane = plane;
    }

    /*
        Updates colliders to be raycasted
        Should be called when board changes position
        Might not be necessary if the board doesn't change position and the scenario changes around it
    */
    updateColliders(pieces, places) {
        this.pieces = pieces;
        this.places = places;
    }

    /*
        Perform raycast, returns object hit or plane position
        objectFlag indicates if the raycast is towards pieces or the plane
        http://schabby.de/picking-opengl-ray-tracing/
        //TODO some things only need to be calculated when camera is updated
    */
    process(scene, camera, objectFlag = true) {

        //Camera info
        this.eyePos = vec3.fromValues(camera.position[0], camera.position[1], camera.position[2]);
        this.eyeDir = vec3.fromValues(camera.target[0], camera.target[1], camera.target[2]);
        this.eyeUp = camera._up;

        //Mouse position
        this.viewport = scene.gl.canvas;
        this.mousePos = {
            x: scene.interface.mouse[0],
            //Flip Y to increase up
            y: this.viewport.height - scene.interface.mouse[1]
        }

        //View
        this.view = vec3.create();
        vec3.subtract(this.view, this.eyeDir, this.eyePos);
        vec3.normalize(this.view, this.view);

        //h & v
        this.h = vec3.create();
        vec3.cross(this.h, this.view, this.eyeUp);
        vec3.normalize(this.h, this.h);
        this.v = vec3.create();
        vec3.cross(this.v, this.h, this.view);
        vec3.normalize(this.v, this.v);

        //h & v length
        this.vLength = Math.tan(camera.fov / 2) * camera.near;
        this.hLength = this.vLength * (this.viewport.width / this.viewport.height);
        vec3.scale(this.h, this.h, this.hLength);
        vec3.scale(this.v, this.v, this.vLength);

        //Map mouse to view port plane
        this.mousePos.x -= this.viewport.width / 2;
        this.mousePos.y -= this.viewport.height / 2;

        this.mousePos.x /= (this.viewport.width / 2);
        this.mousePos.y /= (this.viewport.height / 2);

        //Position
        this.pos = vec3.create();
        this.pos[0] = this.eyePos[0] + this.view[0] * camera.near + this.h[0] * this.mousePos.x + this.v[0] * this.mousePos.y;
        this.pos[1] = this.eyePos[1] + this.view[1] * camera.near + this.h[1] * this.mousePos.x + this.v[1] * this.mousePos.y;
        this.pos[2] = this.eyePos[2] + this.view[2] * camera.near + this.h[2] * this.mousePos.x + this.v[2] * this.mousePos.y;

        //Direction
        this.dir = vec3.create();
        vec3.subtract(this.dir, this.pos, this.eyePos);

        //TODO intersections

        //console.log(this.pos);
        //console.log(this.dir);

        if (this.hitSphere(this.pos, this.dir, vec3.fromValues(0, 0, 0), 5))
            console.log("hit sphere");

        if (this.hitPlane(this.pos, this.dir, vec3.fromValues(0, 0, 0)))
            console.log(this.hitPlane(this.pos, this.dir, vec3.fromValues(0, 0, 0)));

    }

    /*
        Checks intersection between a sphere and a ray
        http://viclw17.github.io/2018/07/16/raytracing-ray-sphere-intersection/
    */
    hitSphere(origin, direction, center, radius) {

        //Vector from ray origin to center of sphere
        var oc = vec3.create();
        vec3.subtract(oc, origin, center);

        //Discriminant
        var a = vec3.dot(direction, direction);
        var b = 2.0 * vec3.dot(oc, direction);
        var c = vec3.dot(oc, oc) - radius * radius;
        var discriminant = b * b - 4 * a * c;

        //Conclusion
        return (discriminant > 0);
    }

    /*
        Calculates intersection point between a plane and a ray
    */
    hitPlane(origin, direction, point, normal = vec3.fromValues(0, 1, 0)) {
        var diff = vec3.create();
        vec3.subtract(diff,origin,point);

        var prod1 = vec3.dot(diff,normal);
        var prod2 = vec3.dot(direction, normal);
        var prod3 = prod1 / prod2;

        vec3.scale(direction,direction,prod3);

        var ret = vec3.create();

        return vec3.subtract(ret, origin, direction);
    }

}