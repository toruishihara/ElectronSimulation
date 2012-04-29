// TronControll.js
// This code is control part of MVC pattarn

// Global variables
var Lines = new Array(); // Lines for sphere
var ViewPole = new tuple3d(1,2,3);
var ViewPoleX;
var ViewPoleY;
var CenterPoint = new tuple3d(0,0,0);
var ZoomValue = 180;

var Timer1;
var Width = 400;
var Height = 400;
var Times = 0;
var Interval = 50; // updating period

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
	//AddTron(0, Math.PI/2, new tronColor(255,0,0));
	//AddTron(0.01, Math.PI/2, new tronColor(0,255,0));
	for (var i=0;i<5;++i) {
		AddTron(Math.PI*2*Math.random(), Math.PI*Math.random(), new tronColor(100*(i%3),30*(i%9),9*(i%27)));
	}
}

function draw(c) {
	var canvas = document.getElementById("canvas1");
	var c = canvas.getContext("2d");
	c.lineWidth = 1;
	ViewPole.unify();
	var axisX = new tuple3d(1,0,0);
	ViewPoleY = ViewPole.cross(axisX);
	ViewPoleY.unify();
	ViewPoleX = ViewPoleY.cross(ViewPole);
	var w2 = Width/2;
	var h2 = Height/2;
	for(var i=0; i < Lines.length; ++i ) {
		var p0 = Lines[i].p0.clone();
		p0.sub(CenterPoint);
		var p1 = Lines[i].p1.clone();
		p1.sub(CenterPoint);
		var x0 = w2 + ZoomValue*p0.dot(ViewPoleX);
		var y0 = h2 + ZoomValue*p0.dot(ViewPoleY);
		var x1 = w2 + ZoomValue*p1.dot(ViewPoleX);
		var y1 = h2 + ZoomValue*p1.dot(ViewPoleY);
		var depth = ViewPole.dot(p0);
		depth *= -100;
		depth += 150;
		var v = depth.toFixed(0);
		var color = "rgb(" + v + "," + v + "," + v + ")";
		drawLine(c, x0, y0, x1, y1, color);
	}
	for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
		p0.sub(CenterPoint);
		var x0 = w2 + ZoomValue*p0.dot(ViewPoleX);
		var y0 = h2 + ZoomValue*p0.dot(ViewPoleY);
		var depth = ViewPole.dot(p0) + 1;
		var r = 256 - (256 - Trons[i].color.r)*depth/2;
		var g = 256 - (256 - Trons[i].color.g)*depth/2;
		var b = 256 - (256 - Trons[i].color.b)*depth/2;
		var color = "rgb(" + r.toFixed(0) + "," + g.toFixed(0) + "," + b.toFixed(0) + ")";
		drawSmallRect(c, x0, y0, color);
	}
	drawInfos();
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
	draw();
}

function clear(){
	var canvas = document.getElementById("canvas1");
	var c = canvas.getContext("2d");
	c.clearRect(0, 0, Width, Height);
}

function mouseDownListner(e) {
	var canvas = document.getElementById("canvas1");
　	canvasOffsetX = canvas.offsetLeft;
　	canvasOffsetY = canvas.offsetTop;
　	var x = e.pageX - canvasOffsetX;
　	var y = e.pageY - canvasOffsetY;
	var moveX = ViewPoleX.clone();
	moveX.mul((x - Width/2)/ZoomValue);
	CenterPoint.add(moveX);
	var moveY = ViewPoleY.clone();
	moveY.mul((y - Height/2)/ZoomValue);
	CenterPoint.add(moveY);
	clear();
	draw();
}

function load(){
	var canvas = document.getElementById("canvas1");
	canvas.onmousedown = mouseDownListner;
	init();
	clear();
	draw();
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

function period_change(value){
	Interval = parseInt(value, 10);
	start();
}
function zoom_change(value){
	ZoomValue = Math.exp((value-20)/10);
	console.log("value=" + value + " zoom=" + ZoomValue);
	clear();
	draw();
}

//c:canvas context
function drawLine(c, x0, y0, x1, y1, color){
	c.strokeStyle = color;
	c.beginPath();
	c.moveTo(x0, y0);
	c.lineTo(x1, y1);
	c.closePath();
	c.stroke();
}
function drawTri(c, x0, y0, x1, y1, x2, y2){
	c.beginPath();
	c.moveTo(x0, y0);
	c.lineTo(x1, y1);
	c.lineTo(x2, y2);
	c.closePath();
	c.stroke();
}
var RectSize = 8;
function drawSmallRect(c, x, y, color){
	c.fillStyle = color;
	c.fillRect(x-RectSize/2, y-RectSize/2, RectSize, RectSize);
}

//c:canvas context
function fillArc(c, color, x, y, r){
	c.fillStyle = color;
	c.beginPath();
	c.arc(x, y, r, 0, Math.PI*2, false);
	c.fill();
}

function setShadow(c, color, blur, offsetX, offsetY){
	c.shadowColor = color; //firefox は必須
	c.shadowBlur = blur;
	c.shadowOffsetX = offsetX;
	c.shadowOffsetY = offsetY;
}

