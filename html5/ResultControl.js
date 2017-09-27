function loadResultView() {
    //init();
    ViewPole = new tuple3d(0, 0, 1);
    ViewPoleX = new tuple3d(1, 0, 0);
    ViewPoleX.unify();
    ViewPoleY = ViewPole.cross(ViewPoleX);
    ViewPoleY.unify();
    ViewPole = ViewPoleX.cross(ViewPoleY);
    ViewPole.unify();
    ViewPoleX = ViewPoleY.cross(ViewPole);
    ViewPoleX.unify();

    width = document.getElementById('sphereCanvas').clientWidth;
    height = document.getElementById('sphereCanvas').clientHeight;
    Renderer = new THREE.WebGLRenderer({ antialias: true });
    Renderer.setSize(width, height);
    document.getElementById('sphereCanvas').appendChild(Renderer.domElement);
    Renderer.setClearColor(new THREE.Color(0xFFFFFF));

    TriangleOpacity = 1.0;
    ZoomDistance = 2000;
    initScene();
    initLight();
    initCamera();
    initObjectThree();

    //drawOuterFaceResults();
    drawInnerFaceResults();

    updateCamera(new tuple3d(0, 0, 0));
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);
}

function drawInnerFaceResults() {
    GlobalFaceColor = new THREE.Color('skyblue');
    //TriangleOpacity = 0.0;
    for (var j = 0; j < 1/*30*/; ++j) {
        ColorCount = 0;
        ModelInit();
        var jsonObj = JSON.parse(results[72 + j]);
        for (var i = 0; i < jsonObj.num; ++i) {
            var p = new tuple3d(jsonObj.vertex[3 * i], jsonObj.vertex[3 * i + 1], jsonObj.vertex[3 * i + 2]);
            p.xy2sp();
            var color = new tronColor("hsl", (i * 47) % 360, "100%", "50%");
            AddTron(p.y, p.z, color);
        }
        hideTron();
        offsetP = new tuple3d(-7 + 3 * (j % 6), 6.5 - 3 * Math.floor(j / 6), 0);
        drawInnerFaceOne(offsetP);
    }
}

function drawOuterFaceResults()
{
    GlobalFaceColor = new THREE.Color('skyblue');
    for (var j = 0; j < 30; ++j) {
        ModelInit();
        var jsonObj = JSON.parse(results[64 + j]);
        for (var i = 0; i < jsonObj.num; ++i) {
            var p = new tuple3d(jsonObj.vertex[3 * i], jsonObj.vertex[3 * i + 1], jsonObj.vertex[3 * i + 2]);
            p.xy2sp();
            var color = new tronColor("hsl", (i * 47) % 360, "100%", "50%");
            AddTron(p.y, p.z, color);
        }
        hideTron();
        OffsetPoint = new tuple3d(-7 + 3 * (j % 6), 6.5 - 3 * Math.floor(j / 6), 0);
        if (j < -3)
        {
            TronThreeRadius = 100.5 * 0.5;
            OffsetPoint.mul(2.0);
        } else {
            TronThreeRadius = 100.5;
        }
        drawFace();
    }
}