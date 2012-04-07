/**
var lines = new Array(15);
lines[0] = "-10,0,0, 10,0,0";
lines[1] = "0,-10,0, 0,10,0";
lines[2] = "0,0,-10, 0,0,10";
lines[3] = "-2,2,2, 2,2,2";
lines[4] = "2,-2,2, 2,2,2";
lines[5] = "2,2,-2, 2,2,2";
lines[6] = "-2,-2,2, 2,-2,2";
lines[7] = "-2,-2,2, -2,2,2";
lines[8] = "-2,2,-2, -2,2,2";
lines[9] = "-2,2,-2, 2,2,-2";
lines[10] = "2,-2,-2, 2,2,-2";
lines[11] = "2,-2,-2, 2,-2,2";
lines[12] = "-2,-2,-2, 2,-2,-2";
lines[13] = "-2,-2,-2, -2,2,-2";
lines[14] = "-2,-2,-2, -2,-2,2";
**/
var lines = new Array(13);
lines[0] = "-10,0,0, 10,0,0";
lines[1] = "0,-10,0, 0,10,0";
lines[2] = "0,0,-10, 0,0,10";
lines[3] = "2,2,0, -2,2,0";
lines[4] = "-2,2,0, -2,-2,0";
lines[5] = "-2,-2,0, 2,-2,0";
lines[6] = "2,-2,0, 2,2,0";
lines[7] = "2,2,0, 0,0,-2";
lines[8] = "-2,2,0, 0,0,-2";
lines[9] = "-2,-2,0, 0,0,-2";
lines[10] = "2,-2,0, 0,0,-2";
lines[11] = "-10,0.2,0, 10,0.2,0";
lines[12] = "-10,-0.2,0, 10,-0.2,0";

var g_viewP = new tuple3d(1,2,3);
var g_viewPx;
var g_viewPy;
var g_center = new tuple3d(0,0,0);
var g_zoom = 10;

var timer1;
var width = 400;
var height = 400;
var time = 0;
var interval = 50; //更新間隔

/* 3d framework class */
function tuple3d(in_x, in_y, in_z){
	this.x = in_x;
	this.y = in_y;
	this.z = in_z;
	this.dot = tuple3d_dot;
	this.unify = tuple3d_unify;
	this.cross = tuple3d_cross;
	this.mul = tuple3d_mul;
	this.add = tuple3d_add;
	this.sub = tuple3d_sub;
	this.xy2sp = tuple3d_xy2sp;
	this.sp2xy = tuple3d_sp2xy;
	this.log = tuple3d_log;
	this.logsp = tuple3d_logsp;
	this.str = tuple3d_str;
	this.strsp = tuple3d_strsp;
	this.clone = tuple3d_clone;
}
function tuple3d_dot(tuple) {
	return this.x*tuple.x + this.y*tuple.y + this.z*tuple.z;
}
function tuple3d_unify() {
	var len2 = this.x*this.x + this.y*this.y + this.z*this.z;
	var len = Math.sqrt(len2);
	this.x = this.x / len;
	this.y = this.y / len;
	this.z = this.z / len;
}
function tuple3d_cross(tuple) {
	var x = this.y*tuple.z - this.z*tuple.y;
	var y = this.z*tuple.x - this.x*tuple.z;
	var z = this.x*tuple.y - this.y*tuple.x;
	return new tuple3d(x,y,z);
}
function tuple3d_mul(v) {
	this.x *= v;
	this.y *= v;
	this.z *= v;
}
function tuple3d_add(tuple) {
	this.x = this.x + tuple.x;
	this.y = this.y + tuple.y;
	this.z = this.z + tuple.z;
}
function tuple3d_sub(tuple) {
	this.x = this.x - tuple.x;
	this.y = this.y - tuple.y;
	this.z = this.z - tuple.z;
}
function tuple3d_sp2xy() {
	var r = this.x;
	var th = this.y;
	var ph = this.z;
	this.x = r*Math.cos(th)*Math.sin(ph);
	this.y = r*Math.sin(th)*Math.sin(ph);
	this.z = r*Math.cos(ph);
}
function tuple3d_xy2sp() {
	var r = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	var th = Math.atan(this.y/this.x);
	var ph = Math.acos(this.z/r);
	this.x = r;
	this.y = th;
	this.z = ph;
}
function tuple3d_log() {
	console.log(" x=" + this.x + " y=" + this.y + " z=" + this.z);
}
function tuple3d_logsp() {
	console.log(" r=" + this.x + " th=" + this.y + " ph=" + this.z);
}
function tuple3d_str() {
	var s = "xyz[" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + "]";
	return s;
}
function tuple3d_strsp() {
	var s = "r,th,ph[" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + "]";
	return s;
}
function tuple3d_clone() {
	var ret = new tuple3d(this.x, this.y, this.z);
	return ret;
}
/* 3d framework class */

function draw(c) {
	var canvas = document.getElementById("canvas1");
	var c = canvas.getContext("2d");
	c.lineWidth = 1;
	g_viewP.unify();
	var axisX = new tuple3d(1,0,0);
	g_viewPy = g_viewP.cross(axisX);
	g_viewPy.unify();
	g_viewPx = g_viewPy.cross(g_viewP);
	for(var i=0; i < lines.length; ++i ) {
		var str = lines[i];
		var e = str.split(',');
		var p0 = new tuple3d(parseFloat(e[0]), parseFloat(e[1]), parseFloat(e[2])); 
		p0.sub(g_center);
		var p1 = new tuple3d(parseFloat(e[3]), parseFloat(e[4]), parseFloat(e[5])); 
		p1.sub(g_center);
		var x0 = width/2 + g_zoom*p0.dot(g_viewPx);
		var y0 = height/2 + g_zoom*p0.dot(g_viewPy);
		var x1 = width/2 + g_zoom*p1.dot(g_viewPx);
		var y1 = height/2 + g_zoom*p1.dot(g_viewPy);
		drawLine(c, x0, y0, x1, y1);
	}
	draw_infos();
}
function draw_infos() {
	document.getElementById("zoom").innerText = g_zoom.toFixed(2);
	document.getElementById("center").innerText = g_center.str();
	var sp = g_viewP.clone();
	var s = sp.str();
	sp.xy2sp();
	s += sp.strsp();
	document.getElementById("view_z").innerText = s;
	var sp2 = g_viewPx.clone();
	s = sp2.str();
	sp2.xy2sp();
	s += sp2.strsp();
	document.getElementById("view_x").innerText = s;
	var sp3 = g_viewPy.clone();
	s = sp3.str();
	sp3.xy2sp();
	s += sp3.strsp();
	document.getElementById("view_y").innerText = s;
}

function update_all(){
	clear();
	update_view();
	draw();
}

function clear(){
	var canvas = document.getElementById("canvas1");
	var c = canvas.getContext("2d");
	c.clearRect(0, 0, width, height);
}

function update_view(){
	g_viewP.y = g_viewP.y - 0.01;
	g_viewP.unify();
	g_zoom = g_zoom *1.01;
}

function mouseDownListner(e) {
	var canvas = document.getElementById("canvas1");
　	canvasOffsetX = canvas.offsetLeft;
　	canvasOffsetY = canvas.offsetTop;
　	var x = e.pageX - canvasOffsetX;
　	var y = e.pageY - canvasOffsetY;
	var moveX = g_viewPx;
	var x_f = (x - width/2);
	x_f /= g_zoom;
	moveX.mul((x - width/2)/g_zoom);
	g_center.add(moveX);
	var moveY = g_viewPy;
	var y_f = (y - height/2);
	y_f /= g_zoom;
	moveY.mul((y - height/2)/g_zoom);
	g_center.add(moveY);
	clear();
	draw();
}

function load(){
	var canvas = document.getElementById("canvas1");
	canvas.onmousedown = mouseDownListner;
	clear();
	draw();
	draw_pole();
}

function start(){
	time = 0;
	clearInterval(timer1);
	update_all();
	timer1 = setInterval("period()", interval);
}

function period(){
	time += 2;
	if (360 < time)
		time = 0;
	update_all();
}

function period_change(value){
	interval = parseInt(value, 10);
	start();
}
function zoom_change(value){
	g_zoom = Math.exp((value-20)/10);
	console.log("value=" + value + " zoom=" + g_zoom);
	clear();
	draw();
}

/* pole */
var pole_wh = 200;
var g_mouseDown = 0;
function draw_pole() {
	var canvas = document.getElementById("pole1");
	var c = canvas.getContext("2d");
	c.lineWidth = 1;
	for(var r=10;r<pole_wh/2;r=r+10) {
		c.beginPath();
		c.arc(pole_wh/2, pole_wh/2, r, 0, Math.PI*2, false);
		c.stroke();
	}
	r -= 10;
	c.lineWidth = 1;
	for(var th=0;th<Math.PI*2;th=th+Math.PI/6) {
		var th2 = th + Math.PI;
		c.beginPath();
		c.moveTo(pole_wh/2 + r*Math.cos(th), pole_wh/2 + r*Math.sin(th));
		c.lineTo(pole_wh/2 + r*Math.cos(th2), pole_wh/2 + r*Math.sin(th2));
		c.closePath();
		c.stroke();
	}
	canvas.onmousedown = PoleMouseDown;
	canvas.onmousemove = PoleMouseMove;
	canvas.onmouseup = PoleMouseUp;
}
function PoleMouseDown(e) {
	g_mouseDown = 1;
	PoleMouseMove(e);
}
function PoleMouseUp(e) {
	g_mouseDown = 0;
}
function PoleMouseMove(e) {
	if (g_mouseDown == 0) {
		return;
	}
	var canvas = document.getElementById("pole1");
　	canvasOffsetX = canvas.offsetLeft;
　	canvasOffsetY = canvas.offsetTop;
　	var x = e.pageX - canvasOffsetX;
　	var y = e.pageY - canvasOffsetY;
	x -= pole_wh/2;
	x /= pole_wh/4;
	y -= pole_wh/2;
	y /= pole_wh/4;
	g_viewP.x = 1;
	g_viewP.z = Math.sqrt(x*x + y*y)*Math.PI/2;
	g_viewP.y = Math.atan2(y,x);
	console.log("x=" + x + " y=" + y + " ph=" + g_viewP.z + " th="+g_viewP.y);
	console.log("x=" + g_viewP.x + " y=" + g_viewP.y + " z=" + g_viewP.z);
	g_viewP.sp2xy();
	clear();
	draw();
}
	
/*
 * 下回りの部品
 */

//c:canvas context
function drawLine(c, x0, y0, x1, y1){
	c.beginPath();
	c.moveTo(x0, y0);
	c.lineTo(x1, y1);
	c.closePath();
	c.stroke();
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

