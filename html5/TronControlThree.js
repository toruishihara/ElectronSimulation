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
var LoopNum = 960*2;
var LoopDelta = 0.01;

var Edge = false;
var Face = false;
var Timer1;
var Times = 0;
var Interval = 50;
var NumTrons = 8;

var Limit = 0.0000001;
var Looping = false;

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
    Edge = document.getElementById('Edge').checked;
    Face = document.getElementById('Face').checked;
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
    	addTronsOnModel();
	//testCylinder();
}
function testCylinder() {
	var col = 0xff00ff;
	var c = createCylinder(0,0,0,0, 50,0,0,5, col, false);
	ThreeScene.add(c);
	c = createCylinder(50,0,0,5, 50,50,0,5, col, false);
	ThreeScene.add(c);
	c = createCylinder(50,50,0,5, 50,50,50,15, col, false);
	ThreeScene.add(c);
	c = createCylinder(50,0,50,5, 50,50,50,15, col, false);
	ThreeScene.add(c);
	c = createCylinder(0,50,50,5, 50,50,50,15, col, false);
	ThreeScene.add(c);
	c = createCylinder(50,0,0,5, 50,0,50,5, col, false);
	ThreeScene.add(c);
	c = createCylinder(0,0,0,0, 0,50,0,5, col, false);
	ThreeScene.add(c);
	c = createCylinder(0,0,0,0, 0,0,50,5, col, false);
	ThreeScene.add(c);
}

function addTronsOnModel() {
    for (var i=0;i<NumTrons;++i) {
        var color = new tronColor("hsl", (i*47)%360, "100%", "50%");
        AddTron(Math.PI*2*Math.random(), Math.PI*Math.random(), color);
        //AddTron(Math.PI*2*Math.random(), Math.PI*0.5, color);
    }
}

function drawViews() {
    updateThree();
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);

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
function clearMapView() {
	var canvas = document.getElementById("mapCanvas");
	canvas.addEventListener("webglcontextlost", function(event) { event.preventDefault(); }, false);
	var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawInfos() {
	document.getElementById("progress").innerText = NumTrons.toFixed(0);
	document.getElementById("totalMove").innerText = TotalMove().toFixed(12);
	document.getElementById("closestPair").innerText = ClosestPair();
	document.getElementById("closestAngle").innerText = ClosestAngle().toFixed(6);
	document.getElementById("loneliestPair").innerText = LoneliestPair();
	document.getElementById("loneliestAngle").innerText = LoneliestAngle().toFixed(6);
}

function updateAll(){
	drawViews();
}

function load(){
	init();
	drawViews();
}

function start(){
	Times = 0;
	init();
    
	hideTrons();
	ModelInit();
	addTronsOnModel();
    
	drawTrons();
	drawViews();

	Looping = true;
	loop();
}
function stop(){
    Looping = false;
}
function reset() {
    	Looping = false;
    	init();
    	initThree();
    	drawTrons();
    	updateCamera();
    	Renderer.clear();
    	Renderer.render(ThreeScene, ThreeCamera);
	drawViews();
}
function movePole(){
	ModelMovePole();
    Looping = false;
	drawViews();
    if (Edge) {
        drawEdge();
    }
    if (Face) {
        drawFace();
    }
    //var s = JSON.sringify(ThreeScene);
    //console.log(s);
}

function period(){
	Times += 1;
	ModelProgress();
	updateAll();
}

function numberChange(value){
	NumTrons = parseInt(value, 10);
    ModelInit();
    drawTrons();
	drawViews();
}
function zoom_change(value){
	ZoomValue = Math.exp((value-20)/10);
	//console.log("value=" + value + " zoom=" + ZoomValue);
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
var RectSize = 2;
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

function loop() {
	hideEdges();
   	ModelProgress();
   	updateThree();
    if (Edge) {
       drawEdge();
    }
    if (Face) {
        drawFace();
    }
   	Renderer.clear();
   	Renderer.render(ThreeScene, ThreeCamera);
    
   	drawMapView();
   	drawInfos();

   	if (Looping) {
       	window.requestAnimationFrame(loop);
   	}
}

function loadThree() {
    	init();
    	initThree();
	ThreeViewLoad();
    	drawTrons();
    	updateCamera();
    	Renderer.clear();
    	Renderer.render(ThreeScene, ThreeCamera);
	drawViews();
}
function loadIndexThree() {
	loadThree();
	var n = Math.floor( 4 + Math.random() * 16 );
	selItem(n);
}

var phase = 0;
var calc_cnt = 0;

function readJson() {
    var num = document.getElementsByName('num')[0].value;
    return readJsonImpl(num);
}

function readJsonImpl(num) {
    hideTrons();
    ModelInit();
    var jsonObj = JSON.parse(results[num]);
    for(var i=0;i<jsonObj.num;++i) {
        var p = new tuple3d(jsonObj.vertex[3*i], jsonObj.vertex[3*i+1], jsonObj.vertex[3*i+2]);
        p.xy2sp();
        var color = new tronColor("hsl", (i*47)%360, "100%", "50%");
        AddTron(p.y, p.z, color);
    }
    NumTrons = Trons.length;
    console.log("N=" + NumTrons);
    drawTrons();
    drawViews();
}

function readJsonAndMove(num) {
    	var jsonObj = JSON.parse(results[num]);
    	for(var i=0;i<jsonObj.num;++i) {
        	var p = new tuple3d(jsonObj.vertex[3*i], jsonObj.vertex[3*i+1], jsonObj.vertex[3*i+2]);
        	MoveTron(i, p.x, p.y, p.z);
    	}
    	var str = "N=" + num + " " + jsonObj.str;
    	var underD = document.getElementById("underDesc");
	if (underD != null) {
		underD.innerText = str;
	}
}

function selItem(num) {
    	console.log("num=" + num);
    	hideTrons();
    	hideEdges();
    	ModelInit();
    	for(var i=0;i<num;++i) {
        	var color = new tronColor("hsl", (i*47)%360, "100%", "50%");
        	AddTron(0, 0, color);
	}
	readJsonAndMove(num);
   	drawTrons();
    if (Edge) {
        drawEdge();
    }
    if (Face) {
        drawFace();
    }
	TourStart();
}
