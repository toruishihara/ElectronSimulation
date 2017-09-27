var ThreeTrons = new Array();
var ThreeEdges = new Array();
var ThreeTriangles = new Array();
var ThreeScene;
var ThreeCamera;
var width, height;
var Renderer;

var TriangleOpacity = 0.5;
var	IsMouseDown = 0;
var	DownX = 0;
var	DownY = 0;
var	DownPole;
var	DownPoleX;
var DownPoleY;

function ThreeViewLoad() {
	var canvas = document.getElementById("sphereCanvas");
	canvas.onmousedown = mouseDownSphere;
	canvas.onmousemove = mouseMoveSphere;
	canvas.onmouseup = mouseUpSphere;
	canvas.ondblclick = mouseDblClickSphere;

	canvas.addEventListener("webglcontextlost", function(event) { event.preventDefault(); }, false);
}

function initThree() {
    	width = document.getElementById('sphereCanvas').clientWidth;
    	height = document.getElementById('sphereCanvas').clientHeight;  
    	Renderer = new THREE.WebGLRenderer({antialias: true});
    	Renderer.setSize(width, height );
    	document.getElementById('sphereCanvas').appendChild(Renderer.domElement);
    	Renderer.setClearColor(new THREE.Color(0xFFFFFF));

    	initScene();    
    	initLight();
    	initCamera();
    	updateCamera(new tuple3d(0,0,0));
    	initObjectThree();
}

function initCamera() {
    ThreeCamera = new THREE.PerspectiveCamera( 45 , width / height , 1 , 10000 );
    ThreeScene.add(ThreeCamera);
}

function updateCamera(center) {
    var pole = ViewPole.clone();
    pole.mul(ZoomDistance);
    ThreeCamera.position.x = pole.x;
    ThreeCamera.position.y = pole.y;
    ThreeCamera.position.z = pole.z;
    ThreeCamera.up.x = ViewPoleY.x;
    ThreeCamera.up.y = ViewPoleY.y;
    ThreeCamera.up.z = ViewPoleY.z;
    ThreeCamera.lookAt( {x:center.x, y:center.y, z:center.z } );
}
function initScene() {    
    ThreeScene = new THREE.Scene();
}
function initLight() {  
    if (AllLight == 1) {
        var x,y,z;
        for(x=-1;x<2;++x) { for(y=-1;y<2;++y) { for(z=-1;z<2;++z) {
         var light = new THREE.PointLight(0xFFFFFF, 1.0, 0);
         light.position.set( 300*x, 300*y, 300*z );
         ThreeScene.add(light);
        } } } 
    } else {
         var light = new THREE.PointLight(0xFFFFFF, 1.0, 0);
         light.position.set( 300, 300, 300 );
         ThreeScene.add(light);
    }

    var ambientLight = new THREE.AmbientLight(0x888888);
    ThreeScene.add(ambientLight);
}

function updateThree(radius) {
    for(var i=0; i < Trons.length && i < ThreeTrons.length; ++i ) {
		var p0 = Trons[i].point.clone();
        p0.mul(radius);
        ThreeTrons[i].position.x = p0.x;
        ThreeTrons[i].position.y = p0.y;
        ThreeTrons[i].position.z = p0.z;
    }
}

function createCylinder(inP0, inP1, r, col)
{
    var p0 = inP0.clone();
    var p1 = inP1.clone();
    var material = new THREE.MeshLambertMaterial({ color: col, ambient: col, opacity: 1.0 });
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r, r, p0.dis(p1), 0, 0, false), material);
    //cylinder.overdraw = true;

    var v = p0.clone();
    v.sub(p1);
    v.xy2spy();
    cylinder.rotation.z = v.z;
    cylinder.rotation.y = 0.5*Math.PI + v.y;
    cylinder.eulerOrder = 'YZX';
    
    var v2 = p0.clone();
    v2.add(p1);
    v2.mul(0.5);
    cylinder.position.x = v2.x;
    cylinder.position.y = v2.y;
    cylinder.position.z = v2.z;
    
    return cylinder;
}

function addLine(p0, p1, col) {
    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(ThreeRadius*p0.x, ThreeRadius*p0.y, ThreeRadius*p0.z);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(ThreeRadius*p1.x, ThreeRadius*p1.y, ThreeRadius*p1.z);
    geometry.vertices.push(vect1);
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:col, opacity: 1.0, lineWidth:5} ));
    ThreeScene.add( line );
}

function initObjectThree() {
    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(250, 0, 0);
    geometry.vertices.push(vect1);
    if (ShowPoleXYZ == 1) {
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0xFF0000, opacity: 1.0, lineWidth:5} ));
        ThreeScene.add( line );
    }

    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(0, 250, 0);
    geometry.vertices.push(vect1);
    if (ShowPoleXYZ == 1) {
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x00FF00, opacity: 1.0, lineWidth:5} ));
        ThreeScene.add( line );
    }

    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(0, 0, 250);
    geometry.vertices.push(vect1);
    if (ShowPoleXYZ == 1) {
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x0000FF, opacity: 1.0, lineWidth:5} ));
        ThreeScene.add( line );
    }
}

function drawSphereFrame(center, radius)
{
    for (var i = 0; i < SphereLines.length; ++i) {
        var geometry = new THREE.Geometry();
        var p0 = SphereLines[i].p0.clone();
        var p1 = SphereLines[i].p1.clone();
        p0.mul(radius);
        p1.mul(radius);
        
        vect0 = new THREE.Vector3(p0.x, p0.y, p0.z);
        geometry.vertices.push(vect0);
        vect1 = new THREE.Vector3(p1.x, p1.y, p1.z);
        geometry.vertices.push(vect1);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x666666, opacity: 0.5, lineWidth:5} ));
        ThreeScene.add( line );
	}
}

function drawDot(p, color, size) {
    var p0 = p.clone();

    console.log("MeshBasicMaterial");
    mat = new THREE.MeshBasicMaterial({color:color});

    var ThreeP = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), mat);
    ThreeScene.add(ThreeP);
    ThreeP.position.set(p0.x, p0.y, p0.z);
    return ThreeP;
}

function hideDot(obj)
{
    ThreeScene.remove(obj);
}


var cnt2 = 0;
var ColorCount = 0;
function drawTriangle(p0, p1, p2, n) {
    if (n == null) {
        var h1 = p1.clone();
        h1.sub(p0);
        var h2 = p2.clone();
        h2.sub(p0);
        n = h1.cross(h2);
        n.unify();
    }
	var dot = n.dot(p0);
	//if (dot < 0.0) {
	//	n.mul(-1.0);
	//}
    var idx = findTronFromNormal(n);
    var col;
    col = Trons[idx].color;
    if (GlobalFaceColor != null) {
        col = GlobalFaceColor;
    }

    var tri;
    //if (dot > 0.0) {
        tri = createTriangle(
            p0.x, p0.y, p0.z,
            p1.x, p1.y, p1.z,
            p2.x, p2.y, p2.z,
			col);
	//} else {
	//	tri = createTriangle(
    //        p2.x, p2.y, p2.z,
    //        p1.x, p1.y, p1.z,
    //        p0.x, p0.y, p0.z,
	//		col);
	//}
    ThreeScene.add(tri);
    ThreeTriangles.push(tri);
	return;
	// Add lines around triangle for debugging
	var d = 0.05;
	var diff = new tuple3d(
		d - Math.random()*2*d,
		d - Math.random()*2*d,
		d - Math.random()*2*d);
	var p0d = p0.clone();
	var p1d = p1.clone();
	var p2d = p2.clone();
	p0d.add(diff);
	p1d.add(diff);
	p2d.add(diff);
	//addLine(p0d, p1d, col);
	//addLine(p1d, p2d, col);
	//addLine(p2d, p0d, col);

	// Add noamrl line around triangle for debugging
	n.mul(0.2);
	var c = p0.clone();
	c.add(p1);
	c.add(p2);
	c.mul(1/3.0);
	n.add(c);
	//addLine(c, n, col);
}

var GlobalFaceColor = null;

function createTriangle(x0,y0,z0, x1,y1,z1, x2,y2,z2, col) {
    var geometry = new THREE.Geometry();
    var vect0 = new THREE.Vector3(x0, y0, z0);
    var vect1 = new THREE.Vector3(x1, y1, z1);
    var vect2 = new THREE.Vector3(x2, y2, z2);
	var face = new THREE.Face3( 
		geometry.vertices.push(vect0)-1,
		geometry.vertices.push(vect1)-1,
		geometry.vertices.push(vect2)-1);

	geometry.faces.push(face);
	geometry.computeFaceNormals();
	//var mat = new THREE.MeshLambertMaterial({color:col, ambient:col, 
	//	opacity:0.5,
	//	side:THREE.FrontSide, transparent:true });

    var mat;
    if (GlobalFaceColor != null) {
        mat = new THREE.MeshLambertMaterial({color: 0xff0000,
            opacity:TriangleOpacity,
            side:THREE.FrontSide, transparent:true });
        mat.color.set(GlobalFaceColor);
        //mat.ambient.set(GlobalFaceColor);
    } else {
        mat = new THREE.MeshLambertMaterial({color: 0xff0000,
		    opacity:TriangleOpacity,
		    side:THREE.FrontSide, transparent:true });
        mat.color.setHSL(col.p1/360.0, 1.0, .5);
        //mat.ambient.setHSL(col.p1/360.0, 1.0, .5);
    }

	var tri = new THREE.Mesh( geometry, mat );
    return tri;
}

function createTriangleOld(x0,y0,z0, x1,y1,z1, x2,y2,z2, col) {
    var geometry = new THREE.Geometry();
    var vect0 = new THREE.Vector3(x0, y0, z0);
    var vect1 = new THREE.Vector3(x1, y1, z1);
    var vect2 = new THREE.Vector3(x2, y2, z2);
	var d01 = vect1.clone();
	d01.sub(vect0);
	var d12 = vect2.clone();
	d12.sub(vect1);
	var d20 = vect0.clone();
	d20.sub(vect2);
    var n = d12.clone();
	n.cross(d20);
	n.normalize();
	var face;
	face = new THREE.Face3( 
		geometry.vertices.push(vect0)-1,
		geometry.vertices.push(vect1)-1,
		geometry.vertices.push(vect2)-1);
	geometry.faces.push(face);

	geometry.computeFaceNormals();
	var material = new THREE.MeshBasicMaterial({color:col, opacity:0.1, side:THREE.DoubleSide });
	var tri = new THREE.Mesh( geometry, material );
    return tri;
}
