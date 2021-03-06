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

var Width = 400;
var Height = 400;

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
	drawSphereView();
	drawMapView();
}

function drawSphereView() {
	var canvas = document.getElementById("sphereCanvas");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	var w2 = canvas.width/2;
	var h2 = canvas.height/2;
    if (WireSphere == 1) {
	  for(var i=0; i < Lines.length; ++i ) {
		var p0 = Lines[i].p0.clone();
		p0.sub(CenterPoint);
		var p1 = Lines[i].p1.clone();
		p1.sub(CenterPoint);
		var x0 = w2 + ZoomValue*p0.dot(ViewPoleX);
		var y0 = h2 + -1*ZoomValue*p0.dot(ViewPoleY);
		var x1 = w2 + ZoomValue*p1.dot(ViewPoleX);
		var y1 = h2 + -1*ZoomValue*p1.dot(ViewPoleY);
		var depth = 0.8*(ViewPole.dot(p0)+1)/2 + 0.2;
		var color = "rgba(0,0,0," + depth.toFixed(1) + ")";
		drawLine(ctx, x0, y0, x1, y1, color);
	  }
	  for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
		p0.sub(CenterPoint);
		var x0 = w2 + ZoomValue*p0.dot(ViewPoleX);
		var y0 = h2 + -1*ZoomValue*p0.dot(ViewPoleY);
		var depth = (ViewPole.dot(p0) + 1)/2;
		drawSmallRect(ctx, x0, y0, Trons[i].color.toStringWithAlpha(depth));
	  }
    }
	drawInfos();
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
	document.getElementById("totalEnergy").innerText = TotalEnergy();
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

	clear();
	drawViews();
}

function load(){
	var canvas = document.getElementById("sphereCanvas");
	canvas.onmousedown = mouseDownSphere;
	canvas.onmousemove = mouseMoveSphere;
	canvas.onmouseup = mouseUpSphere;
	init();
	clear();
	drawViews();
}

function start(){
	Times = 0;
	clearInterval(Timer1);
	updateAll();
	Timer1 = setInterval("period()", Interval);

	var help = document.getElementById("sphereHelp");
	help.style.display = "none";
	help = document.getElementById("mapHelp");
	help.style.display = "none";
	
}
function stop(){
	clearInterval(Timer1);
}
function movePole(){
	ModelMovePole();
	clear();
	drawViews();
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
