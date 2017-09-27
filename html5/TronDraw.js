var TronRadius = 100.5;
var TronOffsetPoint = new tuple3d(0, 0, 0);

function drawTrons() {
    for (var i = 0; i < Trons.length; ++i) {
        var p0 = Trons[i].point.clone();

        mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        mat.color.setHSL(Trons[i].color.p1 / 360.0, 1.0, .5);
        //mat.ambient.setHSL(Trons[i].color.p1/360.0, 1.0, .5);

        ThreeTrons[i] = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), mat);
        ThreeScene.add(ThreeTrons[i]);
        ThreeTrons[i].position.set(TronThreeRadius * p0.x, TronThreeRadius * p0.y, TronThreeRadius * p0.z);
    }
}

function drawEdge() {
    var shortest = 1000;
    for (var i = 0; i < Trons.length; ++i) {
        for (var j = i + 1; j < Trons.length; ++j) {
            var p0 = Trons[i].point.clone();
            var p1 = Trons[j].point.clone();
            var dis = p0.dis(p1);
            if (dis < shortest) {
                shortest = dis;
            }
        }
    }
    for (var i = 0; i < Trons.length; ++i) {
        for (var j = i + 1; j < Trons.length; ++j) {
            var p0 = Trons[i].point.clone();
            var p1 = Trons[j].point.clone();
            var dis = p0.dis(p1);
            if (dis < shortest * 1.01) {
                p0.mul(TronThreeRadius);
                p1.mul(TronThreeRadius);
                var cyl = createCylinder(p0, p1, 2, 0x00ff00);
                ThreeScene.add(cyl);
                ThreeEdges.push(cyl);
            } else if (dis < shortest * 1.42) {
                p0.mul(TronThreeRadius);
                p1.mul(TronThreeRadius);
                var cyl = createCylinder(p0, p1, 1.5, 0x0000ff);
                ThreeScene.add(cyl);
                ThreeEdges.push(cyl);
            }
        }
    }
}

function hideEdge() {
    for (var i = 0; i < ThreeEdges.length; ++i) {
        ThreeScene.remove(ThreeEdges[i]);
    }
    ThreeEdges = new Array();
}

function hideFace() {
    for (var i = 0; i < ThreeTriangles.length; ++i) {
        ThreeScene.remove(ThreeTriangles[i]);
    }
    ThreeTriangles = new Array();
}

function hideTron() {
    for (var i = 0; i < ThreeTrons.length; ++i) {
        ThreeScene.remove(ThreeTrons[i]);
    }
    ThreeTrons = new Array();
}
