//var lines = new Array();
var tris = new Array();

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
function tri3d(in_x0, in_y0, in_z0, in_x1, in_y1, in_z1, in_x2, in_y2, in_z2){
	this.p0 = new tuple3d(in_x0, in_y0, in_z0);
	this.p1 = new tuple3d(in_x1, in_y1, in_z1);
	this.p2 = new tuple3d(in_x2, in_y2, in_z2);
}
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

/* Read STL file */
var req;
var max_x = -999999;
var max_y = -999999;
var max_z = -999999;
var min_x = 999999;
var min_y = 999999;
var min_z = 999999;
function dataReceived() {
	var restr = req.responseText;
	if (restr == undefined || restr.length == 0) {
		return;
	}
	var ls = restr.split("\n");
	var cnt = 0;
	var t0 = new Array(4);
	var t1 = new Array(4);
	var tri_num = 0;
	for (var i=0;i<ls.length;++i) {
		var t = ls[i].split(/\s+/);
		if (t[0] == "") {
			t.shift();
		}
		if(t[0] == "vertex") {
			cnt ++;
			if (cnt == 1) {
				t0 = [].concat(t);
			}
			if (cnt == 2) {
				t1 = [].concat(t);
			}
			if (cnt == 3) {
				var x = parseFloat(t[1]);
				var y = parseFloat(t[2]);
				var z = parseFloat(t[3]);
				var tri = new tri3d(
					parseFloat(t0[1]),parseFloat(t0[2]),parseFloat(t0[3]),
					parseFloat(t1[1]),parseFloat(t1[2]),parseFloat(t1[3]),
					x,y,z);
				tris.push(tri);
				cnt = 0;
				tri_num += 1;
				if (tri_num % 100 == 0 || tri_num < 100) {
					document.getElementById("tri_num").innerText = tri_num;
				}
				if (x > max_x) {
					max_x = x;
				}
				if (y > max_y) {
					max_y = y;
				}
				if (z > max_z) {
					max_z = z;
				}
				if (x < min_x) {
					min_x = x;
				}
				if (y < min_y) {
					min_y = y;
				}
				if (z < min_z) {
					min_z = z;
				}
			}
		}
	}
	if (req.readyState == 4) {
		g_center.x = (max_x + min_x)/2;
		g_center.y = (max_y + min_y)/2;
		g_center.z = (max_z + min_z)/2;
		var maxs = max_x - min_x;
		if (maxs < max_y - min_y) {
			maxs = max_y - min_y;
		}
		if (maxs < max_z - min_z) {
			maxs = max_z - min_z;
		}
		g_zoom = 200/maxs;
		draw();
	}
}
function loadFile(path) {
	req = new XMLHttpRequest();
	req.onreadystatechange = dataReceived;
	req.open("GET", path, true);
	req.send(null);
}
/* Read STL file */

function draw(c) {
	var canvas = document.getElementById("canvas1");
	var c = canvas.getContext("2d");
	c.lineWidth = 1;
	g_viewP.unify();
	var axisX = new tuple3d(1,0,0);
	g_viewPy = g_viewP.cross(axisX);
	g_viewPy.unify();
	g_viewPx = g_viewPy.cross(g_viewP);
	var w2 = width/2;
	var h2 = height/2;
	for(var i=0; i < tris.length; ++i ) {
		var p0 = tris[i].p0.clone();
		p0.sub(g_center);
		var p1 = tris[i].p1.clone();
		p1.sub(g_center);
		var p2 = tris[i].p2.clone();
		p2.sub(g_center);
		var x0 = w2 + g_zoom*p0.dot(g_viewPx);
		var y0 = h2 + g_zoom*p0.dot(g_viewPy);
		var x1 = w2 + g_zoom*p1.dot(g_viewPx);
		var y1 = h2 + g_zoom*p1.dot(g_viewPy);
		var x2 = w2 + g_zoom*p2.dot(g_viewPx);
		var y2 = h2 + g_zoom*p2.dot(g_viewPy);
		drawTri(c, x0, y0, x1, y1, x2, y2);
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
	var moveX = g_viewPx.clone();
	moveX.mul((x - width/2)/g_zoom);
	g_center.add(moveX);
	var moveY = g_viewPy.clone();
	moveY.mul((y - height/2)/g_zoom);
	g_center.add(moveY);
	clear();
	draw();
}

function load(){
	var canvas = document.getElementById("canvas1");
	canvas.onmousedown = mouseDownListner;
	clear();
	//draw();
	loadFile("a.stl");
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
function drawTri(c, x0, y0, x1, y1, x2, y2){
	c.beginPath();
	c.moveTo(x0, y0);
	c.lineTo(x1, y1);
	c.lineTo(x2, y2);
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
