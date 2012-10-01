// TronControll.js
// This code is control part of MVC pattarn


// variable prefixes 
//	ctx : context

// Global variables
var Lines = new Array(); // Lines for sphere
var ViewPole;
var ViewPoleX;
var ViewPoleY;
var CenterPoint = new tuple3d(0,0,0);
var ZoomValue = 180;

var Timer1;
var Width = 400;
var Height = 400;
var Times = 0;
var Interval = 50;
var numTrons = 8;

var ThreeTrons = new Array();

var g_cyl;
var g_looping = false;
var scene;
var g_camera;
var g_ThreeCamera;

function tronColor(type,p1,p2,p3)
{
	this.type = type.concat("");
	this.p1 = p1;  	// Red or Hue
	this.p2 = p2;	// Green or Saturation
	this.p3 = p3;	// Blue or Lightness
	this.toString = tronColor_toString;
	this.toStringWithAlpha = tronColor_toStringWithAlpha;
}
function tronColor_toString()
{
	var str = this.type + "(" + this.p1 + "," + this.p2 + "," + this.p3 + ")";
	return str;
}
function tronColor_toStringWithAlpha(alpha)
{
	var str = this.type + "a(" + this.p1 + "," + this.p2 + "," + this.p3 + "," + alpha.toFixed(1) + ")";
	return str;
}

function init() {
	ViewPole = new tuple3d(-0.3,-0.5,1);
	ViewPoleX = new tuple3d(1,-0.2,0);
	ViewPoleX.unify();
	ViewPoleY = ViewPole.cross(ViewPoleX);
	ViewPoleY.unify();
	ViewPole = ViewPoleX.cross(ViewPoleY);
	ViewPole.unify();
	ViewPoleX = ViewPoleY.cross(ViewPole);
	ViewPoleX.unify();
	for (var p=0;p<Math.PI;p+=Math.PI/6) {
		for (var t=0;t<2*Math.PI;t+=Math.PI/6) {
			var p0 = new tuple3d(1, t-Math.PI/6, p); 
			p0.sp2xy();
			var p1 = new tuple3d(1, t, p); 
			p1.sp2xy();
			var l = new line3d(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
			Lines.push(l);
		}
	}
	for (var t=0;t<2*Math.PI;t+=Math.PI/6) {
		for (var p=0;p<Math.PI;p+=Math.PI/6) {
			var p0 = new tuple3d(1, t, p-Math.PI/6); 
			p0.sp2xy();
			var p1 = new tuple3d(1, t, p); 
			p1.sp2xy();
			var l = new line3d(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
			Lines.push(l);
		}
	}
	ModelInit();
	for (var i=0;i<numTrons;++i) {
		var color = new tronColor("hsl", (i*50)%360, "100%", "50%");
		AddTron(Math.PI*2*Math.random(), Math.PI*Math.random(), color);
	}
}
function drawViews() {
    updateThree();
	drawMapView();
}

// Sinusoidal projection
function calcMapX(tuple) {
	var canvas = document.getElementById("mapCanvas");
	var p = tuple.clone();
	p.sub(CenterPoint);
	p.xy2sp();
	var x = canvas.width/2 + Math.sin(p.z)*2*canvas.width*(p.y/(2*Math.PI))/2;
	return x;
}
function calcMapY(tuple) {
	var canvas = document.getElementById("mapCanvas");
	var p = tuple.clone();
	p.sub(CenterPoint);
	p.xy2sp();
	var y = canvas.height*(p.z/Math.PI);
	return y;
}
function calcMapXEdge(tuple) {
	var canvas = document.getElementById("mapCanvas");
	var p = tuple.clone();
	p.sub(CenterPoint);
	p.xy2sp();
	if (p.y > Math.PI-0.00001) {
		p.y = -1*Math.PI;
	}
	var x = canvas.width/2 + Math.sin(p.z)*2*canvas.width*(p.y/(2*Math.PI))/2;
	return x;
}

function drawMapView() {
	var canvas = document.getElementById("mapCanvas");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	for(var i=0; i < Lines.length; ++i ) {
		var color = "rgb(128,128,128)";
		drawLine(ctx, calcMapX(Lines[i].p0), calcMapY(Lines[i].p0), 
			calcMapX(Lines[i].p1), calcMapY(Lines[i].p1), color);
		drawLine(ctx, calcMapXEdge(Lines[i].p0), calcMapY(Lines[i].p0), 
			calcMapXEdge(Lines[i].p1), calcMapY(Lines[i].p1), color);
	}
	for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
		drawSmallRect(ctx, calcMapX(p0), calcMapY(p0), Trons[i].color.toString());
	}
}
function drawInfos() {
	document.getElementById("progress").innerText = Times.toFixed(0);
	document.getElementById("totalMove").innerText = TotalMove().toFixed(6);
	document.getElementById("closestPair").innerText = ClosestPair();
	document.getElementById("closestAngle").innerText = ClosestAngle().toFixed(6);
	document.getElementById("loneliestPair").innerText = LoneliestPair();
	document.getElementById("loneliestAngle").innerText = LoneliestAngle().toFixed(6);
	var sp = ViewPole.clone();
	var s = sp.str();
	sp.xy2sp();
	s += sp.strsp();
	//document.getElementById("view_z").innerText = s;
	var sp2 = ViewPoleX.clone();
	s = sp2.str();
	sp2.xy2sp();
	s += sp2.strsp();
	//document.getElementById("view_x").innerText = s;
	var sp3 = ViewPoleY.clone();
	s = sp3.str();
	sp3.xy2sp();
	s += sp3.strsp();
	//document.getElementById("view_y").innerText = s;
}

function updateAll(){
	clear();
	drawViews();
}

function clear(){
}

var	IsMouseDown = 0;
var	DownX = 0;
var	DownY = 0;
var	DownPole;
var	DownPoleX;
var	DownPoleY;
function mouseDownShpere(e) {
	IsMouseDown = 1;
	var canvas = document.getElementById("sphereCanvas");
　	canvasOffsetX = canvas.offsetLeft;
　	canvasOffsetY = canvas.offsetTop;
　	DownX = e.pageX - canvasOffsetX;
　	DownY = e.pageY - canvasOffsetY;
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
    g_camera.xy2sp();
    g_camera.z += (x - DownX)/500;
    g_camera.y += (y - DownY)/500;
    g_camera.sp2xy();
    g_ThreeCamera.position.x = g_camera.x;
    g_ThreeCamera.position.y = g_camera.y;
    g_ThreeCamera.position.z = g_camera.z;
    g_ThreeCamera.lookAt( {x:0, y:0, z:0 } );
    renderer.clear();
    renderer.render(scene, g_ThreeCamera);
	console.log("x=" + x + " y=" + y);
}

function load(){
	var canvas = document.getElementById("sphereCanvas");
	canvas.onmousedown = mouseDownShpere;
	canvas.onmousemove = mouseMoveShpere;
	canvas.onmouseup = mouseUpShpere;
	init();
	clear();
	drawViews();
}

function start(){
	Times = 0;
        
    g_looping = true;
    loop();

	var help = document.getElementById("sphereHelp");
	help.style.display = "none";
	help = document.getElementById("mapHelp");
	help.style.display = "none";
	
}
function stop(){
	//clearInterval(Timer1);
}
function movePole(){
	ModelMovePole();
	clear();
    g_looping = false;
	drawViews();
    drawSides();
}

function period(){
	Times += 1;
	ModelProgress();
	updateAll();
}

function numberChange(value){
	numTrons = parseInt(value, 10);
	init();
	clear();
	drawViews();
}
function zoom_change(value){
	ZoomValue = Math.exp((value-20)/10);
	console.log("value=" + value + " zoom=" + ZoomValue);
	clear();
	drawViews();
}

//ctx:canvas context
function drawLine(ctx, x0, y0, x1, y1, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.closePath();
	ctx.stroke();
}
function drawTri(ctx, x0, y0, x1, y1, x2, y2){
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.stroke();
}
var RectSize = 8;
function drawSmallRect(ctx, x, y, color){
	ctx.fillStyle = color;
	ctx.fillRect(x-RectSize/2, y-RectSize/2, RectSize, RectSize);
}

//ctx:canvas context
function fillArc(c, color, x, y, r){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, false);
	ctx.fill();
}

function setShadow(c, color, blur, offsetX, offsetY){
	c.shadowColor = color;
	c.shadowBlur = blur;
	c.shadowOffsetX = offsetX;
	c.shadowOffsetY = offsetY;
}

//Three
var width, height;
var renderer;
function initThree() {
    width = document.getElementById('sphereCanvas').clientWidth;
    height = document.getElementById('sphereCanvas').clientHeight;  
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height );
    document.getElementById('sphereCanvas').appendChild(renderer.domElement);
    renderer.setClearColorHex(0xFFFFFF, 1.0);
}

function initCamera() {
    g_camera = new tuple3d(400, 0.5, 0.5);
    g_camera.sp2xy();
    g_ThreeCamera = new THREE.PerspectiveCamera( 45 , width / height , 1 , 10000 );
    g_ThreeCamera.position.x = g_camera.x;
    g_ThreeCamera.position.y = g_camera.y;
    g_ThreeCamera.position.z = g_camera.z;
    g_ThreeCamera.up.x = 0;
    g_ThreeCamera.up.y = 0;
    g_ThreeCamera.up.z = 1;
    g_ThreeCamera.lookAt( {x:0, y:0, z:0 } );
    scene.add(g_ThreeCamera);
}
function initScene() {    
    scene = new THREE.Scene();
}
var light;
function initLight() {  
    light = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
    light.position.set( 100, 100, 200 );
    scene.add(light);
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

function loop() {
    ModelProgress();
    updateThree();
    renderer.clear();
    renderer.render(scene, g_ThreeCamera);
    
    drawMapView();
    if (g_looping) {
        window.requestAnimationFrame(loop);
    }
}
function viewLoop() {
    camera.position.x -= 10;
    camera.position.y -= 10;
    camera.position.z -= 10;
    
    renderer.clear();
    renderer.render(scene, g_ThreeCamera);
    window.requestAnimationFrame(viewLoop);
}

function loadThree() {
	var canvas = document.getElementById("sphereCanvas");
	canvas.onmousedown = mouseDownShpere;
	canvas.onmousemove = mouseMoveShpere;
	canvas.onmouseup = mouseUpShpere;
    
    initThree();
    initScene();    
    initLight();
    initCamera();
    
    init();
    initObjectThree();

    renderer.clear();
    renderer.render(scene, g_ThreeCamera);
}

function create_cylinder(p0, p1, r, col)
{
    var material = new THREE.MeshLambertMaterial({
                                                 color: col,
                                                 opacity: 0.5
                                                 });
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r, r, p0.dis(p1), 0, 0, false), material);
    cylinder.overdraw = true;

    var v = p0.clone();
    v.sub(p1);
    v.xy2sp_y();
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
    geometry.vertices.push(new THREE.Vertex(vect0));
    vect1 = new THREE.Vector3(250, 0, 0);
    geometry.vertices.push(new THREE.Vertex(vect1));
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0xFF0000, opacity: 1.0, lineWidth:5} ));
    scene.add( line );

    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(new THREE.Vertex(vect0));
    vect1 = new THREE.Vector3(0, 250, 0);
    geometry.vertices.push(new THREE.Vertex(vect1));
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x00FF00, opacity: 1.0, lineWidth:5} ));
    scene.add( line );

    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(new THREE.Vertex(vect0));
    vect1 = new THREE.Vector3(0, 0, 250);
    geometry.vertices.push(new THREE.Vertex(vect1));
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x0000FF, opacity: 1.0, lineWidth:5} ));
    scene.add( line );
    
	for(var i=0; i < Lines.length; ++i ) {
        var geometry = new THREE.Geometry();
		var p0 = Lines[i].p0.clone();
		var p1 = Lines[i].p1.clone();
        p0.mul(100);
        p1.mul(100);
        //var cyl = create_cylinder(p0, p1, 2, 0x00ff00);
        //scene.add(cyl);
        
        vect0 = new THREE.Vector3(p0.x, p0.y, p0.z);
        geometry.vertices.push(new THREE.Vertex(vect0));
        vect1 = new THREE.Vector3(p1.x, p1.y, p1.z);
        geometry.vertices.push(new THREE.Vertex(vect1));
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x000000, opacity: 1.0, lineWidth:5} ));
        scene.add( line );
	}

	for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
        
        mat = new THREE.MeshLambertMaterial({color: 0xff0000});
        mat.color.setHSV(Trons[i].color.p1/360.0, 1.0, 1.0);
        
        ThreeTrons[i] = new THREE.Mesh(
                                 new THREE.CubeGeometry(5,5,5), 
                                 mat
                                 );
        scene.add(ThreeTrons[i]);
        ThreeTrons[i].position.set(100*p0.x, 100*p0.y, 100*p0.z);

	}
    var matc = new THREE.MeshLambertMaterial({color: 0xff00ff});
    g_cyl = new THREE.Mesh(
                    new THREE.CylinderGeometry(10, 10, 100, 5, 5, false),
                    matc);
	//drawInfos();
}

function drawSides() {
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
                scene.add(cyl);
            } else if (dis < shortest*1.5) {
                p0.mul(100);
                p1.mul(100);
                var cyl = create_cylinder(p0, p1, 2, 0x0000ff);
                scene.add(cyl);
            }
        }
	}
}    

