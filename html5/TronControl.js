// TronControll.js
// This code is control part of MVC pattarn


// variable prefixes 
//	ctx : context

// Global variables
var Lines = new Array(); // Lines for sphere
var ViewPole = new tuple3d(0,0,1);
var ViewPoleX = new tuple3d(1,0,0);
var ViewPoleY = new tuple3d(0,1,0);
var CenterPoint = new tuple3d(0,0,0);
var ZoomValue = 180;

var Timer1;
var Width = 400;
var Height = 400;
var Times = 0;
var Interval = 50;
var numTrons = 2;

function tronColor(r,g,b)
{
	this.r = r;
	this.g = g;
	this.b = b;
}

function init() {
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
	AddTron(0, Math.PI/2, new tronColor(255,0,0));
	AddTron(Math.PI/2, Math.PI/2, new tronColor(0,255,0));
	AddTron(0, 0, new tronColor(0,0,255));
	//for (var i=0;i<numTrons;++i) {
	//	AddTron(Math.PI*2*Math.random(), Math.PI*Math.random(), new tronColor(100*(i%3),30*(i%9),9*(i%27)));
	//}
}
function drawViews() {
	drawSphereView();
	drawMapView();
}

function drawSphereView() {
	var canvas = document.getElementById("sphereCanvas");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	var w2 = canvas.width/2;
	var h2 = canvas.height/2;
	for(var i=0; i < Lines.length; ++i ) {
		var p0 = Lines[i].p0.clone();
		p0.sub(CenterPoint);
		var p1 = Lines[i].p1.clone();
		p1.sub(CenterPoint);
		var x0 = w2 + ZoomValue*p0.dot(ViewPoleX);
		var y0 = h2 + -1*ZoomValue*p0.dot(ViewPoleY);
		var x1 = w2 + ZoomValue*p1.dot(ViewPoleX);
		var y1 = h2 + -1*ZoomValue*p1.dot(ViewPoleY);
		var depth = ViewPole.dot(p0);
		depth *= -100;
		depth += 150;
		var v = depth.toFixed(0);
		var color = "rgb(" + v + "," + v + "," + v + ")";
		drawLine(ctx, x0, y0, x1, y1, color);
	}
	for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
		p0.sub(CenterPoint);
		var x0 = w2 + ZoomValue*p0.dot(ViewPoleX);
		var y0 = h2 + -1*ZoomValue*p0.dot(ViewPoleY);
		var depth = ViewPole.dot(p0) + 1;
		var r = 256 - (256 - Trons[i].color.r)*depth/2;
		var g = 256 - (256 - Trons[i].color.g)*depth/2;
		var b = 256 - (256 - Trons[i].color.b)*depth/2;
		var color = "rgb(" + r.toFixed(0) + "," + g.toFixed(0) + "," + b.toFixed(0) + ")";
		drawSmallRect(ctx, x0, y0, color);
	}
	drawInfos();
}
function drawMapView() {
	var canvas = document.getElementById("mapCanvas");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	for(var i=0; i < Lines.length; ++i ) {
		var p0 = Lines[i].p0.clone();
		p0.sub(CenterPoint);
		p0.xy2sp();
		var p1 = Lines[i].p1.clone();
		p1.sub(CenterPoint);
		p1.xy2sp();
		var x0 = canvas.width*((p0.y+Math.PI)/(2*Math.PI));
		var y0 = canvas.height*(p0.z/Math.PI);
		var x1 = canvas.width*((p1.y+Math.PI)/(2*Math.PI));
		var y1 = canvas.height*(p1.z/Math.PI);
		var color = "rgb(128,128,128)";
		drawLine(ctx, x0, y0, x1, y1, color);
	}
	for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
		p0.sub(CenterPoint);
		p0.xy2sp();
		var th = p0.y;
		var ph = p0.z;
		var x0 = canvas.width*((th+Math.PI)/(2*Math.PI));
		var y0 = canvas.height*(ph/Math.PI);
		var color = "rgb(" + Trons[i].color.r.toFixed(0) + "," + Trons[i].color.g.toFixed(0) + "," + Trons[i].color.b.toFixed(0) + ")";
		drawSmallRect(ctx, x0, y0, color);
	}
}
function drawInfos() {
	document.getElementById("progress").innerText = Times.toFixed(0);
	document.getElementById("zoom").innerText = ZoomValue.toFixed(2);
	document.getElementById("center").innerText = CenterPoint.str();
	var sp = ViewPole.clone();
	var s = sp.str();
	sp.xy2sp();
	s += sp.strsp();
	document.getElementById("view_z").innerText = s;
	var sp2 = ViewPoleX.clone();
	s = sp2.str();
	sp2.xy2sp();
	s += sp2.strsp();
	document.getElementById("view_x").innerText = s;
	var sp3 = ViewPoleY.clone();
	s = sp3.str();
	sp3.xy2sp();
	s += sp3.strsp();
	document.getElementById("view_y").innerText = s;
}

function updateAll(){
	clear();
	drawViews();
}

function clear(){
	var canvas = document.getElementById("sphereCanvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var canvas = document.getElementById("mapCanvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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
	console.log("x=" + x + " y=" + y);
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
	/*
	Z1.mul(Math.sin(x));
	ViewPoleX.add(Z1);
	X1.mul(x*Math.sin(x));
	ViewPoleX.add(X1);

	X2.mul(-1*Math.sin(x));
	ViewPole.add(X2);
	Z2.mul(x*Math.sin(x));
	ViewPole.add(X2);

	Z3.mul(Math.sin(y));
	ViewPoleY.add(Z3);
	Y1.mul(-1*y*Math.sin(y));
	ViewPoleY.add(Y1);

	Y2.mul(-1*Math.sin(y));
	ViewPole.add(Y2);
	Z4.mul(-1*y*Math.sin(y));
	ViewPole.add(Z4);

	ViewPole.unify();
	ViewPoleX.unify();
	ViewPoleY.unify();
	*/

	clear();
	drawViews();
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
	clearInterval(Timer1);
	updateAll();
	Timer1 = setInterval("period()", Interval);
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
	c.shadowColor = color; //firefox は必須
	c.shadowBlur = blur;
	c.shadowOffsetX = offsetX;
	c.shadowOffsetY = offsetY;
}

