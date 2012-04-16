// Global variables
var Triangles = new Array();
var ViewPole = new tuple3d(1,2,3);
var ViewPoleX;
var ViewPoleY;
var CenterPoint = new tuple3d(0,0,0);
var ZoomValue = 10;

var Timer1;
var Width = 400;
var Height = 400;
var Times = 0;
var Interval = 50; // updating period

/* Read STL file */
var Req;
var max_x = -999999;
var max_y = -999999;
var max_z = -999999;
var min_x = 999999;
var min_y = 999999;
var min_z = 999999;
function dataReceived() {
	var restr = Req.responseText;
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
				Triangles.push(tri);
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
	if (Req.readyState == 4) {
		CenterPoint.x = (max_x + min_x)/2;
		CenterPoint.y = (max_y + min_y)/2;
		CenterPoint.z = (max_z + min_z)/2;
		var maxs = max_x - min_x;
		if (maxs < max_y - min_y) {
			maxs = max_y - min_y;
		}
		if (maxs < max_z - min_z) {
			maxs = max_z - min_z;
		}
		ZoomValue = 200/maxs;
		draw();
	}
}
function loadFile(path) {
	Req = new XMLHttpRequest();
	Req.onreadystatechange = dataReceived;
	Req.open("GET", path, true);
	Req.send(null);
}
/* Read STL file */

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
	for(var i=0; i < Triangles.length; ++i ) {
		var p0 = Triangles[i].p0.clone();
		p0.sub(CenterPoint);
		var p1 = Triangles[i].p1.clone();
		p1.sub(CenterPoint);
		var p2 = Triangles[i].p2.clone();
		p2.sub(CenterPoint);
		var x0 = w2 + ZoomValue*p0.dot(ViewPoleX);
		var y0 = h2 + ZoomValue*p0.dot(ViewPoleY);
		var x1 = w2 + ZoomValue*p1.dot(ViewPoleX);
		var y1 = h2 + ZoomValue*p1.dot(ViewPoleY);
		var x2 = w2 + ZoomValue*p2.dot(ViewPoleX);
		var y2 = h2 + ZoomValue*p2.dot(ViewPoleY);
		drawTri(c, x0, y0, x1, y1, x2, y2);
	}
	draw_infos();
}
function draw_infos() {
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

function update_all(){
	clear();
	update_view();
	draw();
}

function clear(){
	var canvas = document.getElementById("canvas1");
	var c = canvas.getContext("2d");
	c.clearRect(0, 0, Width, Height);
}

function update_view(){
	ViewPole.y = ViewPole.y - 0.01;
	ViewPole.unify();
	ZoomValue = ZoomValue *1.01;
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
	clear();
	//draw();
	loadFile("a.stl");
	draw_pole();
}

function start(){
	Times = 0;
	clearInterval(Timer1);
	update_all();
	Timer1 = setInterval("period()", Interval);
}

function period(){
	Times += 2;
	if (360 < Times)
		Times = 0;
	update_all();
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
	ViewPole.x = 1;
	ViewPole.z = Math.sqrt(x*x + y*y)*Math.PI/2;
	ViewPole.y = Math.atan2(y,x);
	ViewPole.sp2xy();
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
