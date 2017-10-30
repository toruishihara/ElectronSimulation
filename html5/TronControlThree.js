// TronControll.js
// This code is control part of MVC pattarn


// variable prefixes 
//	ctx : context

// Global variables
var SphereLines = new Array(); // Lines for sphere
var ViewPole;
var ViewPoleX;
var ViewPoleY;
var CenterPoint = new tuple3d(0,0,0);
var ViewCenter = new tuple3d(0,0,0);
var ZoomValue = 180;
var ZoomDistance = 500;
//var LoopNum = 960*2;
var LoopNum = 100;
var LoopDelta = 0.01;
var Width = 800;
var Height = 800;
var Edge = false;
var Face = false;
var Timer1;
var Times = 0;
var Interval = 50;
var NumTrons = 6;
var ShowFaceEdge = 0;
var AllLight = 0;
var LogFaceToJson = 0;
var TronThreeRadius = 100.5;
var RegularLimit = 0.0000001; // Finest
//var RegularLimit = 0.00001;
var CriticalLimit = 0.000000001; // Finest
//var CriticalLimit = 0.00001;
var Looping = false;

var WhiteFace = 0;
var WireSphere = 0;
var ShowPoleXYZ = 0;

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
    //Edge = document.getElementById('Edge').checked;
    //Face = document.getElementById('Face').checked;
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
			SphereLines.push(l);
		}
	}
	for (var t=0;t<2*Math.PI;t+=Math.PI/6) {
		for (var p=0;p<Math.PI;p+=Math.PI/6) {
			var p0 = new tuple3d(1, t, p-Math.PI/6); 
			p0.sp2xy();
			var p1 = new tuple3d(1, t, p); 
			p1.sp2xy();
			var l = new line3d(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
			SphereLines.push(l);
		}
	}
	ModelInit();
    addTronsOnModel();
}

function addTronsOnModel() {
    for (var i=0;i<NumTrons;++i) {
        var color = new tronColor("hsl", (i*47)%360, "100%", "50%");
        AddTron(Math.PI*2*Math.random(), Math.PI*Math.random(), color);
        //AddTron(Math.PI*2*Math.random(), Math.PI*0.5, color);
    }
}

var lastEdge = false;
var lastFace = false;
function drawViews() {
    updateThree(TronThreeRadius);
    if (Edge != lastEdge) {
        if (Edge) { drawEdge(); } else { hideEdge(); }
        lastEdge = Edge;
    }
    if (Face != lastFace) {
        if (Face) { drawFace(); } else { hideFace(); }
        lastFace = Face;
        if (WhiteFace > 0) {
            hideTron();
        }
    }
    updateCamera(new tuple3d(ViewCenter.x * TronThreeRadius, ViewCenter.y * TronThreeRadius, ViewCenter.z * TronThreeRadius));
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
    if (canvas == null)
        return;
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	for (var i = 0; i < SphereLines.length; ++i) {
		var color = "rgb(128,128,128)";
		drawLine(ctx, calcMapX(SphereLines[i].p0), calcMapY(SphereLines[i].p0),
			calcMapX(SphereLines[i].p1), calcMapY(SphereLines[i].p1), color);
		drawLine(ctx, calcMapXEdge(SphereLines[i].p0), calcMapY(SphereLines[i].p0),
			calcMapXEdge(SphereLines[i].p1), calcMapY(SphereLines[i].p1), color);
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
	document.getElementById("aveMove").innerText = getAveMove().toFixed(12);
	document.getElementById("totalEnergy").innerText = TotalEnergy();
	document.getElementById("closestPair").innerText = ClosestPair();
	document.getElementById("closestAngle").innerText = ClosestAngle().toFixed(6);
	document.getElementById("loneliestPair").innerText = LoneliestPair();
	document.getElementById("loneliestAngle").innerText = LoneliestAngle().toFixed(6);
	document.getElementById("Angle21").innerText = getAngle21().toFixed(6);
	document.getElementById("Angle31").innerText = getAngle31().toFixed(6);
}

function updateAll(){
	drawViews();
}

function load(){
	init();
	drawViews();
}

function performanceTest()
{
    var st = new Date();
    document.getElementById("result").innerText += "start=" + st.getTime();

    var sum = 0.0;
    var i;
    for (i = 1; i < 1000000000; i=i+2)
    {
        if (i % 4 == 1)
        {
            sum = sum + 1.0 / i;
        }
        else
        {
            sum = sum - 1.0 / i;
        }
    }
    sum = sum * 4;
    var ed = new Date();
    document.getElementById("result").innerText += "end=" + ed.getTime();
    var diff = ed.getTime() - st.getTime();
    console.log("diff = " + diff);
    document.getElementById("result").innerText += "diff=" + diff + " pie=" + sum;

}

function startSimulation() {
    performanceTest();
	Times = 0;
	init();
    
	hideTron();
	ModelInit();
	addTronsOnModel();
    
	drawTrons();
	drawViews();

	Looping = true;
	loop();
}
function stopSimulation(){
    Looping = false;
}
function reset() {
    Looping = false;
    init();
    initThree();
    drawTrons();
    updateCamera(new tuple3d(ViewCenter.x * TronThreeRadius, ViewCenter.y * TronThreeRadius, ViewCenter.z * TronThreeRadius));
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);
	drawViews();
}
function movePole(){
	ModelMovePole();
    Looping = false;
	drawViews();
    if (Edge) { drawEdge(); }
    if (Face) { drawFace(); }
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
	hideEdge();
   	ModelProgress();
   	updateThree(TronThreeRadius);
    if (Edge) { drawEdge(); }
    if (Face) { drawFace(); }
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
    drawSphereFrame(new tuple3d(0, 0, 0), 100.5);
	ThreeViewLoad();
    drawTrons();
    updateCamera(new tuple3d(ViewCenter.x * TronThreeRadius, ViewCenter.y * TronThreeRadius, ViewCenter.z * TronThreeRadius));
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
    hideTron();
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

    updateClosest();
    updateLoneliest();
    updateAngles();
    updateEnergy();
    drawInfos();
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
    	hideTron();
    	hideEdge();
    	ModelInit();
    	for(var i=0;i<num;++i) {
        	var color = new tronColor("hsl", (i*47)%360, "100%", "50%");
        	AddTron(0, 0, color);
	}
	readJsonAndMove(num);
   	drawTrons();
    if (Edge) { drawEdge(); }
    if (Face) { drawFace(); }
	TourStart();
}

function OnViewValueChange() {
    ZoomDistance = document.getElementById("Zoom").value;
    Edge = document.getElementById('Edge').checked;
    Face = document.getElementById('Face').checked;
	//ZoomValue = Math.exp((value-20)/10);
	console.log(" zoom=" + ZoomDistance);
	drawViews();
}

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
    if (IsMouseDown == 0) return;
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

    updateCamera(new tuple3d(ViewCenter.x * TronThreeRadius, ViewCenter.y * TronThreeRadius, ViewCenter.z * TronThreeRadius));
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);
}
function mouseDblClickSphere(e) {
    var canvas = document.getElementById("sphereCanvas");
    canvasOffsetX = canvas.offsetLeft;
    canvasOffsetY = canvas.offsetTop;
    var x = e.pageX - canvasOffsetX - 0.5 * width;
    var y = e.pageY - canvasOffsetY - 0.5 * height;
    console.log("dblclick x=" + x + " y=" + y);
    x /= TronThreeRadius;
    y /= TronThreeRadius;

    var X1 = DownPoleX.clone();
    var Y1 = DownPoleY.clone();
    var Z1 = DownPole.clone();
    var Z2 = DownPole.clone();

    console.log("X1=[" + X1.x + "," + X1.y + "," + X1.z + "]");
    console.log("Y1=[" + Y1.x + "," + Y1.y + "," + Y1.z + "]");
    console.log("Z1=[" + Z1.x + "," + Z1.y + "," + Z1.z + "]");

    console.log("C0=[" + ViewCenter.x + "," + ViewCenter.y + "," + ViewCenter.z + "]");
    var dx = X1.clone();
    var dx2 = X1.clone();
    dx2.mul(0.8);
    addTronLine(CenterPoint, dx2, 0xFF0000);
    dx.mul(x);
    ViewCenter.add(dx);

    var dy = Y1.clone();
    var dy2 = Y1.clone();
    dy2.mul(0.8);
    addTronLine(CenterPoint, dy2, 0x00FF00);

    dy.mul(y);
    ViewCenter.add(dy);
    console.log("C=[" + ViewCenter.x + "," + ViewCenter.y + "," + ViewCenter.z + "]");
    console.log("CP=[" + CenterPoint.x + "," + CenterPoint.y + "," + CenterPoint.z + "]");
    addTronLine(CenterPoint, ViewCenter, 0xFFFF00);

    updateCamera(new tuple3d(ViewCenter.x * TronThreeRadius, ViewCenter.y * TronThreeRadius, ViewCenter.z * TronThreeRadius));
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);
}
