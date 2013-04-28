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

var Timer1;
var Times = 0;
var Interval = 50;
var NumTrons = 8;
var Limit = 0.0000001;
var StoryLimit = 0.0000001;

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

    initScene();    
    initLight();
    initCamera();
    updateCamera();
    initObjectThree();
}

function addTronsOnModel() {
    for (var i=0;i<NumTrons;++i) {
        var color = new tronColor("hsl", (i*50)%360, "100%", "50%");
        AddTron(Math.PI*2*Math.random(), Math.PI*Math.random(), color);
        //AddTron(Math.PI*2*Math.random(), Math.PI*0.5, color);
    }
}

function drawViews() {
    updateThree();
    renderer.clear();
    renderer.render(ThreeScene, ThreeCamera);

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

var tour_t = 0;
function tour() {
    tour_t = 0;
    tourLoop();
}

function tourLoop() {
    tour_t++;
    var x = 0;
    var y = 0;
    if (tour_t < LoopNum/3) {
        x = LoopDelta*2;
    } else if (tour_t < LoopNum*2/3) {
        y = LoopDelta*2;
    } else if (tour_t < LoopNum) {
        x = y = LoopDelta;
    }
    
	var X1 = ViewPoleX.clone();
	var Y1 = ViewPoleY.clone();
	var Z1 = ViewPole.clone();
	var Z2 = ViewPole.clone();
    
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

    updateCamera();
    renderer.clear();
    renderer.render(ThreeScene, ThreeCamera);
    
    if (tour_t < LoopNum) {
        window.requestAnimationFrame(tourLoop);
    }
}

function load(){
	ThreeViewLoad();
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
function movePole(){
	ModelMovePole();
    Looping = false;
	drawViews();
    drawSides();
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
    ModelProgress();
    updateThree();
    renderer.clear();
    renderer.render(ThreeScene, ThreeCamera);
    
    drawMapView();
    drawInfos();

    if (Looping) {
        window.requestAnimationFrame(loop);
    }
}

function loadThree() {
    	initThree();
    
	ThreeViewLoad();
    	init();
    	drawTrons();
    
    	updateCamera();

    	renderer.clear();
    	renderer.render(ThreeScene, ThreeCamera);
}
function loadIndexThree() {
	loadThree();
	var n = Math.floor( 4 + Math.random() * 16 );
	selItem(n);
}

var phase = 0;
var calc_cnt = 0;
var story_tour_cnt = 0;

function storyLoop()
{
    //console.log("phase=" + phase + " cnt=" + calc_cnt + " cnt2=" + story_tour_cnt);
    var wait = 0;
    if (phase == 0) {
        calc_cnt++;
        ModelProgress();
        updateThree();
        drawMapView();
        drawInfos();
        if (TotalMove() < Limit && calc_cnt > 100) {
            phase = 1;
        }
    } else {
        if (story_tour_cnt == 0) {
            hideTrons();

            //ModelMovePole();
            drawTrons();
            drawSides();
        }
        story_tour_cnt ++;
        var x = 0;
        var y = 0;
        if (story_tour_cnt < LoopNum/3) {
            x = LoopDelta*2;
        } else if (story_tour_cnt < LoopNum*2/3) {
            y = LoopDelta*2;
        } else if (story_tour_cnt < LoopNum) {
            x = y = LoopDelta;
        }
        
        var X1 = ViewPoleX.clone();
        var Y1 = ViewPoleY.clone();
        var Z1 = ViewPole.clone();
        var Z2 = ViewPole.clone();
        
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
        
        updateCamera();
        if (story_tour_cnt > LoopNum) {
            logJson();
            hideSides();
            calc_cnt = 0;
            story_tour_cnt = 0;
            phase = 0;
            hideTrons();
            //clearMapView();
            //ModelInit();
            NumTrons ++;
            //addTronsOnModel();
            var color = new tronColor("hsl", (NumTrons*50)%360, "100%", "50%");
            launchTron(color);

            drawTrons();
        }
            
    }
    renderer.clear();
    renderer.render(ThreeScene, ThreeCamera);

    if (Looping) {
    	window.requestAnimationFrame(storyLoop);
    }
}

function movieLoop()
{
    //console.log("phase=" + phase + " cnt=" + calc_cnt + " cnt2=" + story_tour_cnt);
    var wait = 0;
    if (phase == 0) {
        calc_cnt++;
        var str = "N=" + NumTrons;
        document.getElementById("underDesc").innerText = str;
        ModelProgress();
	if (calc_cnt % 20 <= 20) {
            updateThree();
            drawMapView();
            drawInfos();
	}
        if (TotalMove() < Limit && calc_cnt > 100) {
            phase = 1;
        }
	if (calc_cnt > 1000) {
            phase = 1;
            hideTrons();
	    readJsonAndMove(NumTrons);
            drawTrons();
	    _sleep(500);
	}
    } else {
        if (story_tour_cnt == 0) {
            hideTrons();

            //ModelMovePole();
            drawTrons();
            drawSides();
	    _sleep(500);
        }
        story_tour_cnt ++;
        var x = 0;
        var y = 0;
        if (story_tour_cnt < LoopNum/3) {
            x = 2*LoopDelta;
        } else if (story_tour_cnt < LoopNum*2/3) {
            y = 2*LoopDelta;
        } else if (story_tour_cnt < LoopNum) {
            x = y = LoopDelta;
        }
        
        var X1 = ViewPoleX.clone();
        var Y1 = ViewPoleY.clone();
        var Z1 = ViewPole.clone();
        var Z2 = ViewPole.clone();
        
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
        
	if (story_tour_cnt % 2 == 0 || NumTrons > 3) {
        	updateCamera();
	}
        if (story_tour_cnt > LoopNum) {
            logJson();
            hideSides();
            calc_cnt = 0;
            story_tour_cnt = 0;
            phase = 0;
            hideTrons();
            //clearMapView();
            //ModelInit();
            NumTrons ++;
            //addTronsOnModel();
            var color = new tronColor("hsl", (NumTrons*50)%360, "100%", "50%");
            launchTron(color);

            drawTrons();
        }
            
    }
    renderer.clear();
    renderer.render(ThreeScene, ThreeCamera);

    if (Looping) {
    	window.requestAnimationFrame(movieLoop);
    }
}

function story() {
    return storyCleanStart();
}

function storyContinue() {
    NumTrons = Trons.length;
    console.log("n=" + NumTrons);
    drawTrons();
    drawViews();

    Looping = true;
    Limit = StoryLimit;
    storyLoop();
}

function storyCleanStart() {
    NumTrons = 2;
    init();
    
    hideTrons();
    ModelInit();
    //addTronsOnModel();

    var color = new tronColor("hsl", (0*50)%360, "100%", "50%");
    AddTron(0.0, 0.0, color);
    var color2 = new tronColor("hsl", (1*50)%360, "100%", "50%");
    AddTron(0.0, Math.PI, color2);

    drawTrons();
    drawViews();

    Looping = true;
    Limit = StoryLimit;
    storyLoop();
}

function movie() {
    NumTrons = 2;
    init();
    
    hideTrons();
    ModelInit();

    var color = new tronColor("hsl", (0*50)%360, "100%", "50%");
    AddTron(0.0, 0.0, color);
    var color2 = new tronColor("hsl", (1*50)%360, "100%", "50%");
    AddTron(0.0, Math.PI, color2);

    drawTrons();
    drawViews();

    Looping = true;
    Limit = StoryLimit;
    movieLoop();
}

function launchTron(color) {
    var p = FindFreePoint();
    p.xy2sp();
    AddTron(p.y, p.z, color);
}

function launchTronFromCenter(color) {
    var p = FindFreePoint();
    p.xy2sp();
    AddTronWithVelo(p.y, p.z, color);
}

function clear() {
    storyClearStart();
}

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
        var color = new tronColor("hsl", (i*50)%360, "100%", "50%");
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
    	hideSides();
    	ModelInit();
    	for(var i=0;i<num;++i) {
        	var color = new tronColor("hsl", (i*50)%360, "100%", "50%");
        	AddTron(0, 0, color);
	}
	readJsonAndMove(num);
    	drawTrons();
    	drawSides();
	tour();
}
