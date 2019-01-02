
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
        Constructor with all the colliders to be used
        pieces - board pieces
        places - board places
        plane - horizontal(XZ) plane (just a Y value)
    */
    constructor(scene, pieces, places, plane, radius = 1) {

        this.scene = scene;

        this.pieces = pieces;
        this.places = places;
        this.plane = plane;

        this.radius = radius;

    }

    /*
        Prepare camera
        Only needs to be called when camera changes
    */
    prepare(){

        //Canvas
        this.viewport = {
            width: this.scene.gl.canvas.width,
            height: this.scene.gl.canvas.height
        };

        //Camera info
        this.eyePos = vec3.fromValues(this.scene.camera.position[0], this.scene.camera.position[1], this.scene.camera.position[2]);
        this.eyeDir = vec3.fromValues(this.scene.camera.target[0], this.scene.camera.target[1], this.scene.camera.target[2]);
        this.eyeUp = this.scene.camera._up;

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
        this.vLength = Math.tan(this.scene.camera.fov / 2) * this.scene.camera.near;
        this.hLength = this.vLength * (this.viewport.width / this.viewport.height);
        vec3.scale(this.h, this.h, this.hLength);
        vec3.scale(this.v, this.v, this.vLength);

    }

    /*
        Perform raycast, returns object hit or plane position
        http://schabby.de/picking-opengl-ray-tracing/
    */
    process(type) {
        
        //Canvas was resized, need to process camera again
        if(this.viewport.width != this.scene.gl.canvas.width || this.viewport.height != this.scene.gl.canvas.height){
            this.prepare();
        }

        //Mouse position
        this.mousePos = {
            x: this.scene.interface.mouse[0],
            //Flip Y to increase up
            y: this.viewport.height - this.scene.interface.mouse[1]
        }

        //Map mouse to view port plane
        this.mousePos.x -= this.viewport.width / 2;
        this.mousePos.y -= this.viewport.height / 2;

        this.mousePos.x /= (this.viewport.width / 2);
        this.mousePos.y /= (this.viewport.height / 2);

        //Position
        this.pos = vec3.create();
        this.pos[0] = this.eyePos[0] + this.view[0] * this.scene.camera.near + this.h[0] * this.mousePos.x + this.v[0] * this.mousePos.y;
        this.pos[1] = this.eyePos[1] + this.view[1] * this.scene.camera.near + this.h[1] * this.mousePos.x + this.v[1] * this.mousePos.y;
        this.pos[2] = this.eyePos[2] + this.view[2] * this.scene.camera.near + this.h[2] * this.mousePos.x + this.v[2] * this.mousePos.y;

        //Direction
        this.dir = vec3.create();
        vec3.subtract(this.dir, this.pos, this.eyePos);

        //Intersections
        switch (type) {
            case "pieces":
                for (let i = 0; i < this.pieces.length; i++) {
                    if (this.hitSphere(this.pos, this.dir, vec3.fromValues(this.pieces[i].x, 0, this.pieces[i].z), this.radius)) {
                        this.pieces[i].hit();
                        return this.pieces[i];
                    }
                }
                return false;
            case "plane":
                return this.hitPlane(this.pos, this.dir, vec3.fromValues(0, 0, 0));
            case "places":
                for (let i = 0; i < this.places.length; i++) {
                    if (this.hitSphere(this.pos, this.dir, vec3.fromValues(this.places[i].x, 0, this.places[i].z), this.radius)) {
                        this.places[i].hit();
                        return this.places[i];
                    }
                }
                return false;
            default:
                break;
        }

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
        vec3.subtract(diff, origin, point);

        var prod1 = vec3.dot(diff, normal);
        var prod2 = vec3.dot(direction, normal);
        var prod3 = prod1 / prod2;

        vec3.scale(direction, direction, prod3);

        var ret = vec3.create();

        return vec3.subtract(ret, origin, direction);
    }

}