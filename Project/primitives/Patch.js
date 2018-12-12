
class Patch extends CGFobject {

    constructor(scene, degree1, degree2, pointsRAW, divX, divY) {
        super(scene);
        this.scene = scene;
        
        //Format points
        var control = [];
        var pointId = 0;
        for (let u = 0; u < degree1; u++) {
            var uArray = [];
            for (let v = 0; v < degree2; v++) {
                var point = [pointsRAW[pointId].x, pointsRAW[pointId].y, pointsRAW[pointId].z, 1];
                uArray.push(point);
                pointId++;
            }
            control.push(uArray);
        }

        //Surface
        var surf = new CGFnurbsSurface(degree1 - 1, degree2 - 1, control);

        //Object
        this.obj = new CGFnurbsObject(this.scene, divX, divY, surf);

    };

    display(){
        this.obj.display();
    }

}