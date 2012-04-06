
/* 2009/08/18, 2010/03/03
・タイマー処理 setInterval のサンプル
・sin関数を描くアニメーション
・負荷テスト
  毎回クリアして最初から描画しているので、360度に近くなるほど
　描画の量が増えるようになっている。CPUの稼働率がどう変わるか？
*/
var lines = new Array(12);
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

var g_viewP = new tuple3d(1,2,3);
var g_viewPx;
var g_viewPy;
var g_center = new tuple3d(0,0,0);
var g_zoom = 10;

var timer1;
var width = 300;
var height = 200;
var time = 0;
var interval = 50; //更新間隔

function tuple3d(in_x, in_y, in_z){
	this.x = in_x;
	this.y = in_y;
	this.z = in_z;
	this.dot = tuple3d_dot;
	this.unify = tuple3d_unify;
	this.cross = tuple3d_cross;
}
function tuple3d_dot(tuple) {
	return this.x*tuple.x + this.y*tuple.y + this.z*tuple.z;
}
function tuple3d_unify() {
	var len2 = this.x*this.x + this.y + this.y + this.z + this.z;
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

function draw(c) {
	var canvas = document.getElementById("canvas1");
	var c = canvas.getContext("2d");
	c.lineWidth = 1;
	g_viewP.unify();
	g_viewPx = g_viewP.cross(new tuple3d(1,0,0));
	g_viewPy = g_viewP.cross(new tuple3d(0,1,0));
	for(var i=0; i < lines.length; ++i ) {
		var str = lines[i];
		var e = str.split(',');
		var p0 = new tuple3d(parseFloat(e[0]), parseFloat(e[1]), parseFloat(e[2])); 
		var p1 = new tuple3d(parseFloat(e[3]), parseFloat(e[4]), parseFloat(e[5])); 
		var x0 = width/2 + g_zoom*p0.dot(g_viewPx);
		var y0 = height/2 + g_zoom*p0.dot(g_viewPy);
		var x1 = width/2 + g_zoom*p1.dot(g_viewPx);
		var y1 = height/2 + g_zoom*p1.dot(g_viewPy);
		drawLine(c, x0, y0, x1, y1);
	}
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
	g_viewP.x = g_viewP.x + 0.01;
	g_viewP.y = g_viewP.y - 0.01;
	g_viewP.z = g_viewP.z - 0.01;
}

function start(c){
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

