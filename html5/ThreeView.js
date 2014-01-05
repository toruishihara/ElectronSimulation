var ThreeTrons = new Array();
var ThreeEdges = new Array();
var ThreeTriangles = new Array();
var ThreeScene;
var ThreeCamera;
var width, height;
var Renderer;

var ThreeRadius = 100.5;

var	IsMouseDown = 0;
var	DownX = 0;
var	DownY = 0;
var	DownPole;
var	DownPoleX;
var	DownPoleY;

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
    	Renderer.setClearColorHex(0xFFFFFF, 1.0);

    	initScene();    
    	initLight();
    	initCamera();
    	updateCamera();
    	initObjectThree();
}

function initCamera() {
    ThreeCamera = new THREE.PerspectiveCamera( 45 , width / height , 1 , 10000 );
    ThreeScene.add(ThreeCamera);
}

function updateCamera() {
    var pole = ViewPole.clone();
    pole.mul(ZoomDistance);
    ThreeCamera.position.x = pole.x;
    ThreeCamera.position.y = pole.y;
    ThreeCamera.position.z = pole.z;
    ThreeCamera.up.x = ViewPoleY.x;
    ThreeCamera.up.y = ViewPoleY.y;
    ThreeCamera.up.z = ViewPoleY.z;
    ThreeCamera.lookAt( {x:ViewCenter.x*ThreeRadius, y:ViewCenter.y*ThreeRadius, z:ViewCenter.z*ThreeRadius } );
}
function initScene() {    
    ThreeScene = new THREE.Scene();
}
function initLight() {  
    var light = new THREE.PointLight(0xFFFFFF, 1.0, 0);
    light.position.set( 100, 100, 200 );
    ThreeScene.add(light);
    //var light2 = new THREE.PointlLight(0x888888, 1.0, 0);
    //light2.position.set( -1000, -1000, -2000 );
    //ThreeScene.add(light2);
    var ambientLight = new THREE.AmbientLight(0x888888);
    ThreeScene.add(ambientLight);
}

function updateThree() {
    for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
        p0.mul(ThreeRadius);
        ThreeTrons[i].position.x = p0.x;
        ThreeTrons[i].position.y = p0.y;
        ThreeTrons[i].position.z = p0.z;
    }
}

function mouseDownSphere(e) {
	IsMouseDown = 1;
	var canvas = document.getElementById("sphereCanvas");
　	canvasOffsetX = canvas.offsetLeft;
　	canvasOffsetY = canvas.offsetTop;
　	DownX = e.pageX - canvasOffsetX;
　	DownY = e.pageY - canvasOffsetY;
    	DownPole = ViewPole.clone();
	DownPoleX = ViewPoleX.clone();
	DownPoleY = ViewPoleY.clone();
}
function mouseUpSphere(e) {
	IsMouseDown = 0;
}
function mouseMoveSphere(e) {
	if (IsMouseDown == 0)	return;
	var canvas = document.getElementById("sphereCanvas");
　	canvasOffsetX = canvas.offsetLeft;
　	canvasOffsetY = canvas.offsetTop;
    var x = e.pageX - canvasOffsetX;
    var y = e.pageY - canvasOffsetY;
	var tmpX = x;
	var tmpY = y;
	x -= DownX;
	y -= DownY;
	//console.log("x=" + x + " y=" + y);
	x *= -1;
	x /= ZoomValue;
	y /= ZoomValue;
	var X1 = DownPoleX.clone();
	var Y1 = DownPoleY.clone();
	var Z1 = DownPole.clone();
	var Z2 = DownPole.clone();
    
	X1.mul(Math.cos(x));
	Z1.mul(Math.sin(x));
	ViewPoleX = X1;
	ViewPoleX.sub(Z1);
    
	Y1.mul(Math.cos(y));
	Z2.mul(Math.sin(y));
	ViewPoleY = Y1;
	ViewPoleY.sub(Z2);
    
	ViewPole = ViewPoleX.cross(ViewPoleY);
	ViewPole.unify();
	ViewPoleX = ViewPoleY.cross(ViewPole);
	ViewPoleX.unify();
	ViewPoleY = ViewPole.cross(ViewPoleX);
	ViewPoleY.unify();

    updateCamera();
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);
}
function mouseDblClickSphere(e) {
	var canvas = document.getElementById("sphereCanvas");
　	canvasOffsetX = canvas.offsetLeft;
　	canvasOffsetY = canvas.offsetTop;
    var x = e.pageX - canvasOffsetX - 0.5*width;
    var y = e.pageY - canvasOffsetY - 0.5*height;
	console.log("dblclick x=" + x + " y=" + y);
    x /= ThreeRadius;
    y /= ThreeRadius;

	var X1 = DownPoleX.clone();
	var Y1 = DownPoleY.clone();
	var Z1 = DownPole.clone();
	var Z2 = DownPole.clone();

    console.log("X1=[" + X1.x + "," + X1.y + "," + X1.z + "]");
    console.log("Y1=[" + Y1.x + "," + Y1.y + "," + Y1.z + "]");
    console.log("Z1=[" + Z1.x + "," + Z1.y + "," + Z1.z + "]");

    console.log("C0=[" + ViewCenter.x + "," + ViewCenter.y + "," + ViewCenter.z + "]");
    var dx = X1.clone();
    var dx2 = X1.clone();
    dx2.mul(0.8);
    addLine(CenterPoint, dx2, 0xFF0000);
    dx.mul(x);
    ViewCenter.add(dx);

    var dy = Y1.clone();
    var dy2 = Y1.clone();
    dy2.mul(0.8);
    addLine(CenterPoint, dy2, 0x00FF00);

    dy.mul(y);
    ViewCenter.add(dy);
    console.log("C=[" + ViewCenter.x + "," + ViewCenter.y + "," + ViewCenter.z + "]");
    console.log("CP=[" + CenterPoint.x + "," + CenterPoint.y + "," + CenterPoint.z + "]");
    addLine(CenterPoint, ViewCenter, 0xFFFF00);

    updateCamera();
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);
}

function createCylinder(x0,y0,z0,r0, x1,y1,z1,r1, col, open)
{
	var v = new THREE.Vector3(x0-x1, y0-y1, z0-z1);
	var len = v.length();
	var material = new THREE.MeshLambertMaterial({ color:col, ambient:col, opacity:1.0 });
	var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, 0, 0, open), material);
	//cylinder.overdraw = true;

	if (len > 0.001) {
		cylinder.rotation.z = Math.acos(v.y/len);
		cylinder.rotation.y = 0.5*Math.PI + Math.atan2(v.x, v.z);
		cylinder.eulerOrder = 'YZX';
	}
    
	cylinder.position.x = (x1+x0)/2;
	cylinder.position.y = (y1+y0)/2;
	cylinder.position.z = (z1+z0)/2;
    
	return cylinder;
}

function create_cylinder(p0, p1, r, col)
{
    var material = new THREE.MeshLambertMaterial({ color:col, ambient:col, opacity:1.0 });
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
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0xFF0000, opacity: 1.0, lineWidth:5} ));
    ThreeScene.add( line );

    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(0, 250, 0);
    geometry.vertices.push(vect1);
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x00FF00, opacity: 1.0, lineWidth:5} ));
    ThreeScene.add( line );

    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(0, 0, 250);
    geometry.vertices.push(vect1);
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x0000FF, opacity: 1.0, lineWidth:5} ));
    ThreeScene.add( line );

	for(var i=0; i < Lines.length; ++i ) {
        var geometry = new THREE.Geometry();
		var p0 = Lines[i].p0.clone();
		var p1 = Lines[i].p1.clone();
        p0.mul(ThreeRadius);
        p1.mul(ThreeRadius);
        
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
    ThreeP.position.set(ThreeRadius*p0.x, ThreeRadius*p0.y, ThreeRadius*p0.z);
    return ThreeP;
}

function hideDot(obj)
{
    ThreeScene.remove(obj);
}

function drawTrons() {
	for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
        
        mat = new THREE.MeshLambertMaterial({color: 0xff0000});
        mat.color.setHSL(Trons[i].color.p1/360.0, 1.0, .5);
        mat.ambient.setHSL(Trons[i].color.p1/360.0, 1.0, .5);
        
        ThreeTrons[i] = new THREE.Mesh(new THREE.CubeGeometry(5,5,5), mat);
        ThreeScene.add(ThreeTrons[i]);
        ThreeTrons[i].position.set(ThreeRadius*p0.x, ThreeRadius*p0.y, ThreeRadius*p0.z);
	}
}

function drawEdge() {
    var shortest = 1000;
	for(var i=0; i < Trons.length; ++i ) {
        for(var j=i+1; j < Trons.length; ++j ) {
            var p0 = Trons[i].point.clone();
            var p1 = Trons[j].point.clone();
            var dis = p0.dis(p1);
            if (dis < shortest) {
                shortest = dis;
            }
        }
	}
	for(var i=0; i < Trons.length; ++i ) {
        for(var j=i+1; j < Trons.length; ++j ) {
            var p0 = Trons[i].point.clone();
            var p1 = Trons[j].point.clone();
            var dis = p0.dis(p1);
            if (dis < shortest*1.01) {
                p0.mul(ThreeRadius);
                p1.mul(ThreeRadius);
                var cyl = create_cylinder(p0, p1, 2, 0x00ff00);
                ThreeScene.add(cyl);
                ThreeEdges.push(cyl);
            } else if (dis < shortest*1.42) {
                p0.mul(ThreeRadius);
                p1.mul(ThreeRadius);
                var cyl = create_cylinder(p0, p1, 1.5, 0x0000ff);
                ThreeScene.add(cyl);
                ThreeEdges.push(cyl);
            }
        }
	}
} 

function hideEdge() {
    for (var i=0;i<ThreeEdges.length;++i) {
        ThreeScene.remove(ThreeEdges[i]);
    }
    ThreeEdges = new Array();
}

function hideFace() {
    for (var i=0;i<ThreeTriangles.length;++i) {
        ThreeScene.remove(ThreeTriangles[i]);
    }
    ThreeTriangles = new Array();
}

function hideTron() {
    for (var i=0;i<ThreeTrons.length;++i) {
        ThreeScene.remove(ThreeTrons[i]);
    }
    ThreeTrons = new Array();
}

var cnt2 = 0;
function drawTriangle(p0, p1, p2) {
	var h1 = p1.clone(); 
	h1.sub(p0);
	var h2 = p2.clone(); 
	h2.sub(p0);
	var n = h1.cross(h2);
	n.unify();
	var dot = n.dot(p0);
	if (dot < 0.0) {
		n.mul(-1.0);
	}
    var idx = findTronFromNormal(n);
    var col = Trons[idx].color;
    // Calculate color from normal
	//var col = Math.floor(Math.abs(n.x)*255) << 16;
	//col += Math.floor(Math.abs(n.y)*255) << 8;
	//col += Math.floor(Math.abs(n.z)*255);
    //
	//var col = Math.floor((n.x+1.0)*127) << 16;
	//col += Math.floor((n.y+1.0)*127) << 8;
	//col += Math.floor((n.z+1.0)*127);
	var tri;
	if (dot > 0.0) {
		tri = createTriangle(
			ThreeRadius*p0.x, ThreeRadius*p0.y, ThreeRadius*p0.z,
			ThreeRadius*p1.x, ThreeRadius*p1.y, ThreeRadius*p1.z,
			ThreeRadius*p2.x, ThreeRadius*p2.y, ThreeRadius*p2.z,
			col);
	} else {
		tri = createTriangle(
			ThreeRadius*p2.x, ThreeRadius*p2.y, ThreeRadius*p2.z,
			ThreeRadius*p1.x, ThreeRadius*p1.y, ThreeRadius*p1.z,
			ThreeRadius*p0.x, ThreeRadius*p0.y, ThreeRadius*p0.z,
			col);
	}
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
	addLine(p0d, p1d, col);
	addLine(p1d, p2d, col);
	addLine(p2d, p0d, col);

	// Add noamrl line around triangle for debugging
	n.mul(0.2);
	var c = p0.clone();
	c.add(p1);
	c.add(p2);
	c.mul(1/3.0);
	n.add(c);
	addLine(c, n, col);
}
 
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

    var mat = new THREE.MeshLambertMaterial({color: 0xff0000,
		opacity:0.5,
		side:THREE.FrontSide, transparent:true });
    mat.color.setHSL(col.p1/360.0, 1.0, .5);
    mat.ambient.setHSL(col.p1/360.0, 1.0, .5);

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
