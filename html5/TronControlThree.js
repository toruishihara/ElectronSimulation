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

var Timer1;
var Width = 400;
var Height = 400;
var Times = 0;
var Interval = 50;
var NumTrons = 8;
var Limit = 0.000000001;
var StoryLimit = 0.0000000001;

var ThreeTrons = new Array();
var ThreeSides = new Array();

var Looping = false;
var ThreeScene;
var ThreeCamera;

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
	canvas.addEventListener("webglcontextrestored", setupWebGLStateAndResources, false);
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

    updateCamera();

    renderer.clear();
    renderer.render(ThreeScene, ThreeCamera);
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
    if (tour_t < 320) {
        x = 0.02;
    } else if (tour_t < 640) {
        y = 0.02;
    } else if (tour_t < 960) {
        x = y = 0.01;
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
    
    if (tour_t < 960) {
        window.requestAnimationFrame(tourLoop);
    }
}

function load(){
	var canvas = document.getElementById("sphereCanvas");
	canvas.onmousedown = mouseDownShpere;
	canvas.onmousemove = mouseMoveShpere;
	canvas.onmouseup = mouseUpShpere;

	canvas.addEventListener("webglcontextlost", function(event) { event.preventDefault(); }, false);
	canvas.addEventListener("webglcontextrestored", setupWebGLStateAndResources, false);

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

//Three
var width, height;
var renderer;
function initThree() {
    width = document.getElementById('sphereCanvas').clientWidth;
    height = document.getElementById('sphereCanvas').clientHeight;  
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height );
    document.getElementById('sphereCanvas').appendChild(renderer.domElement);
    renderer.setClearColorHex(0xFFFFFF, 1.0);
}

function initCamera() {
    ThreeCamera = new THREE.PerspectiveCamera( 45 , width / height , 1 , 10000 );
    ThreeScene.add(ThreeCamera);
}

function updateCamera() {
    var pole = ViewPole.clone();
    pole.mul(400);
    ThreeCamera.position.x = pole.x;
    ThreeCamera.position.y = pole.y;
    ThreeCamera.position.z = pole.z;
    ThreeCamera.up.x = ViewPoleY.x;
    ThreeCamera.up.y = ViewPoleY.y;
    ThreeCamera.up.z = ViewPoleY.z;
    ThreeCamera.lookAt( {x:0, y:0, z:0 } );
}
function initScene() {    
    ThreeScene = new THREE.Scene();
}
var light;
function initLight() {  
    light = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
    light.position.set( 100, 100, 200 );
    ThreeScene.add(light);
    light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
    light2.position.set( -1000, -1000, -2000 );
    ThreeScene.add(light2);
}

function updateThree() {
    for(var i=0; i < Trons.length; ++i ) {
	var p0 = Trons[i].point.clone();
        p0.mul(100);
        ThreeTrons[i].position.x = p0.x;
        ThreeTrons[i].position.y = p0.y;
        ThreeTrons[i].position.z = p0.z;
    }
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

	var canvas = document.getElementById("sphereCanvas");
	canvas.onmousedown = mouseDownShpere;
	canvas.onmousemove = mouseMoveShpere;
	canvas.onmouseup = mouseUpShpere;
    
    init();
    drawTrons();
    
    updateCamera();

    renderer.clear();
    renderer.render(ThreeScene, ThreeCamera);
}

function create_cylinder(p0, p1, r, col)
{
    var material = new THREE.MeshLambertMaterial({
                                                 color: col,
                                                 opacity: 1.0
                                                 });
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r, r, p0.dis(p1), 0, 0, false), material);
    cylinder.overdraw = true;

    var v = p0.clone();
    v.sub(p1);
    v.xy2spy();
    cylinder.rotation.z = v.z;
    cylinder.rotation.y = 0.5*Math.PI + v.y;
    cylinder.eulerOrder = 'YZX';
    
    var v2 = p0.clone();
    v2.add(p1);
    v2.mul(0.5);
    cylinder.position.x = v2.x;
    cylinder.position.y = v2.y;
    cylinder.position.z = v2.z;
    
    return cylinder;
}

function initObjectThree() {
    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(250, 0, 0);
    geometry.vertices.push(vect1);
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0xFF0000, opacity: 1.0, lineWidth:5} ));
    ThreeScene.add( line );

    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(0, 250, 0);
    geometry.vertices.push(vect1);
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x00FF00, opacity: 1.0, lineWidth:5} ));
    ThreeScene.add( line );

    var geometry = new THREE.Geometry();
    vect0 = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(vect0);
    vect1 = new THREE.Vector3(0, 0, 250);
    geometry.vertices.push(vect1);
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x0000FF, opacity: 1.0, lineWidth:5} ));
    ThreeScene.add( line );

	for(var i=0; i < Lines.length; ++i ) {
        var geometry = new THREE.Geometry();
		var p0 = Lines[i].p0.clone();
		var p1 = Lines[i].p1.clone();
        p0.mul(100);
        p1.mul(100);
        
        vect0 = new THREE.Vector3(p0.x, p0.y, p0.z);
        geometry.vertices.push(vect0);
        vect1 = new THREE.Vector3(p1.x, p1.y, p1.z);
        geometry.vertices.push(vect1);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color:0x666666, opacity: 0.5, lineWidth:5} ));
        ThreeScene.add( line );
	}
}

function drawDot(p, color, size) {
    var p0 = p.clone();

    mat = new THREE.MeshLambertMaterial({color: 0xff0000});
    mat.color.setHSV(color/360.0, 1.0, 1.0);

    var ThreeP = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), mat);
    ThreeScene.add(ThreeP);
    ThreeP.position.set(100*p0.x, 100*p0.y, 100*p0.z);
    return ThreeP;
}

function hideDot(obj)
{
    ThreeScene.remove(obj);
}

function drawTrons() {
	for(var i=0; i < Trons.length; ++i ) {
		var p0 = Trons[i].point.clone();
        
        mat = new THREE.MeshLambertMaterial({color: 0xff0000});
        mat.color.setHSV(Trons[i].color.p1/360.0, 1.0, 1.0);
        
        ThreeTrons[i] = new THREE.Mesh(new THREE.CubeGeometry(5,5,5), mat);
        ThreeScene.add(ThreeTrons[i]);
        ThreeTrons[i].position.set(100*p0.x, 100*p0.y, 100*p0.z);
	}
}

function drawSides() {
    var shortest = 1000;
	for(var i=0; i < Trons.length; ++i ) {
        for(var j=i+1; j < Trons.length; ++j ) {
            var p0 = Trons[i].point.clone();
            var p1 = Trons[j].point.clone();
            var dis = p0.dis(p1);
            if (dis < shortest) {
                shortest = dis;
            }
        }
	}
	for(var i=0; i < Trons.length; ++i ) {
        for(var j=i+1; j < Trons.length; ++j ) {
            var p0 = Trons[i].point.clone();
            var p1 = Trons[j].point.clone();
            var dis = p0.dis(p1);
            if (dis < shortest*1.01) {
                p0.mul(100);
                p1.mul(100);
                var cyl = create_cylinder(p0, p1, 2, 0x00ff00);
                ThreeScene.add(cyl);
                ThreeSides.push(cyl);
            } else if (dis < shortest*1.5) {
                p0.mul(100);
                p1.mul(100);
                var cyl = create_cylinder(p0, p1, 1.5, 0x0000ff);
                ThreeScene.add(cyl);
                ThreeSides.push(cyl);
            }
        }
	}
} 

function hideSides() {
    for (var i=0;i<ThreeSides.length;++i) {
        ThreeScene.remove(ThreeSides[i]);
    }
    ThreeSides = new Array();
}

function hideTrons() {
    for (var i=0;i<ThreeTrons.length;++i) {
        ThreeScene.remove(ThreeTrons[i]);
    }
    ThreeTrons = new Array();
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
        if (story_tour_cnt < 320) {
            x = 0.02;
        } else if (story_tour_cnt < 640) {
            y = 0.02;
        } else if (story_tour_cnt < 960) {
            x = y = 0.01;
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
        if (story_tour_cnt > 960) {
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

function story() {
    return storyCleanStart();
}

function storyStart() {
    init();
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

function launchTron(color) {
    var p = FindFreePoint();
    p.xy2sp();
    AddTron(p.y, p.z, color);
}

function clear() {
    storyClearStart();
}

function readJson() {
    hideTrons();
    ModelInit();
    var num = document.getElementsByName('num')[0].value;
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

