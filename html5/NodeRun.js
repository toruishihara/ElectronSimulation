var fs = require('fs');
var join = require('path').join;

var document = require("node-jsdom").jsdom(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>title</title>
</head>
<body>
<div>
progress=<span id="progress"></span><br>
Ave movement in this step=<span id="aveMove"></span><br>
TotalEnergy=<span id="totalEnergy"></span><br>
Closest pair=<span id="closestPair"></span><br>
Closest distance(digree)=<span id="closestAngle"></span><br>
Loniest one and its closest pair=<span id="loneliestPair"></span><br>
distance(digree)=<span id="loneliestAngle"></span><br>
distance2-1(digree)=<span id="Angle21"></span><br>
distance3-1(digree)=<span id="Angle31"></span><br>
</div>
<div id="result" style="top:200px;left:20px;width:100%;background-color:#FFFFFF">
</body>
</html>
`);

var THREE = require('/home/ubuntu/git/node-three.js');

eval(fs.readFileSync('ThreeView.js')+'');
eval(fs.readFileSync('Tuple.js')+'');
eval(fs.readFileSync('TronControlThree.js')+'');
eval(fs.readFileSync('TourControlThree.js')+'');
eval(fs.readFileSync('StoryControlThree.js')+'');
eval(fs.readFileSync('TronModel.js')+'');
eval(fs.readFileSync('TronDraw.js')+'');
eval(fs.readFileSync('DrawFace.js')+'');
eval(fs.readFileSync('jsutil.js')+'');
eval(fs.readFileSync('results.js')+'');
eval(fs.readFileSync('GoldBurg.js')+'');

// On ThreeView.js
width = 500;
height = 500;
Renderer = new THREE.CanvasRenderer();
Renderer.setSize(width, height);

init();
initScene();
initLight();
initCamera();
updateCamera(new tuple3d(0,0,0));
initObjectThree();

story();
