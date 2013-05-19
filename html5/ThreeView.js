var ThreeTrons = new Array();
var ThreeEdges = new Array();
var ThreeScene;
var ThreeCamera;
var width, height;
var renderer;

var	IsMouseDown = 0;
var	DownX = 0;
var	DownY = 0;
var	DownPole;
var	DownPoleX;
var	DownPoleY;

function ThreeViewLoad() {
	var canvas = document.getElementById("sphereCanvas");
	canvas.onmousedown = mouseDownShpere;
	canvas.onmousemove = mouseMoveShpere;
	canvas.onmouseup = mouseUpShpere;

	canvas.addEventListener("webglcontextlost", function(event) { event.preventDefault(); }, false);
}

function initThree() {
    	width = document.getElementById('sphereCanvas').clientWidth;
    	height = document.getElementById('sphereCanvas').clientHeight;  
    	renderer = new THREE.WebGLRenderer({antialias: true});
    	renderer.setSize(width, height );
    	document.getElementById('sphereCanvas').appendChild(renderer.domElement);
    	renderer.setClearColorHex(0xFFFFFF, 1.0);

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
    pole.mul(270);
    ThreeCamera.position.x = pole.x;
    ThreeCamera.position.y = pole.y;
    ThreeCamera.position.z = pole.z;
    ThreeCamera.up.x = ViewPoleY.x;
    ThreeCamera.up.y = ViewPoleY.y;
    ThreeCamera.up.z = ViewPoleY.z;
    ThreeCamera.lookAt( {x:0, y:0, z:0 } );
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
        p0.mul(100);
        ThreeTrons[i].position.x = p0.x;
        ThreeTrons[i].position.y = p0.y;
        ThreeTrons[i].position.z = p0.z;
    }
}

function mouseDownShpere(e) {
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
function mouseUpShpere(e) {
	IsMouseDown = 0;
}
function mouseMoveShpere(e) {
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

    renderer.clear();
    renderer.render(ThreeScene, ThreeCamera);
}

function createCylinder(x0,y0,z0,r0, x1,y1,z1,r1, col, open)
{
	var v = new THREE.Vector3(x0-x1, y0-y1, z0-z1);
	var len = v.length();
	var material = new THREE.MeshLambertMaterial({ color:col, ambient:col, opacity:1.0 });
	var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, 0, 0, open), material);
	cylinder.overdraw = true;

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
    cylinder.overdraw = true;

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
        p0.mul(100);
        p1.mul(100);
        
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
    //mat = new THREE.MeshLambertMaterial({color:0xff0000});
    mat = new THREE.MeshBasicMaterial({color:0xff0000});
    //mat.color.setHSV(color/360.0, 1.0, 1.0);
    //mat.ambient.setHSV(color/360.0, 1.0, 1.0);

    var ThreeP = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), mat);
    ThreeScene.add(ThreeP);
    ThreeP.position.set(100*p0.x, 100*p0.y, 100*p0.z);
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
        mat.color.setHSV(Trons[i].color.p1/360.0, 1.0, 1.0);
        mat.ambient.setHSV(Trons[i].color.p1/360.0, 1.0, 1.0);
        
        ThreeTrons[i] = new THREE.Mesh(new THREE.CubeGeometry(5,5,5), mat);
        ThreeScene.add(ThreeTrons[i]);
        ThreeTrons[i].position.set(100*p0.x, 100*p0.y, 100*p0.z);
	}
}

function drawEdges() {
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
                p0.mul(100);
                p1.mul(100);
                var cyl = create_cylinder(p0, p1, 2, 0x00ff00);
                ThreeScene.add(cyl);
                ThreeEdges.push(cyl);
            } else if (dis < shortest*1.42) {
                p0.mul(100);
                p1.mul(100);
                var cyl = create_cylinder(p0, p1, 1.5, 0x0000ff);
                ThreeScene.add(cyl);
                ThreeEdges.push(cyl);
            }
        }
	}
} 

function hideEdges() {
    for (var i=0;i<ThreeEdges.length;++i) {
        ThreeScene.remove(ThreeEdges[i]);
    }
    ThreeEdges = new Array();
}

function hideTrons() {
    for (var i=0;i<ThreeTrons.length;++i) {
        ThreeScene.remove(ThreeTrons[i]);
    }
    ThreeTrons = new Array();
}
 
