// TronControll.js
// This code is control part of MVC pattarn
// variable prefixes 
//	ctx : context
var GoldBurgN = 5;
var isoAngle = 63.4949*Math.PI/180.0;

function drawGoldBurgView() {
console.log("drawGoldBurg");
	var canvas = document.getElementById("GoldBurgCanvas");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
    var n = 5;
	var color = "rgb(128,128,128)";
    var px, py;
    var root3 = Math.sqrt(3.0);
    var tx = new tuple3d(1,0,0);
    var ty = new tuple3d(0.5,0.5*root3,0);

    for(var i=0;i<=n;++i) {
        tx0 = tx.clone();
        tx0.mul(i/n);
        for(var j=0;j<=n-i;++j) {
            t = new tuple3d(0,0,0);
            ty0 = ty.clone();
            ty0.mul(j/n);
            t.add(tx0);
            t.add(ty0);
            
            drawSmallRect(ctx, 100*t.x, 100*t.y, color);
            //console.log("[" + i + "," + j + "]=" + t.x + " , " + t.y);
        }
    }
}

var faceN = 0;
// tx,ty is triangle unit vector
function addOneGoldBurgFace(p0, tx, ty) {
    var color = new tronColor("hsl", (faceN*47)%360, "100%", "50%");
    ++faceN;

    for(var i=0;i<=GoldBurgN;++i) {
        tx0 = tx.clone();
        tx0.mul(i/GoldBurgN);
        for(var j=0;j<=GoldBurgN-i;++j) {
            var p = p0.clone();
            ty0 = ty.clone();
            ty0.mul(j/GoldBurgN);
            p.add(tx0);
            p.add(ty0);
            p.unify();
            p.xy2sp();
            AddTron(p.y, p.z, color);
            
            //console.log("[" + i + "," + j + "]=" + p.y + " , " + p.z);
        }
    }
}

var isoPoints = new Array(); // iso points
function calcGoldBurg() {
    console.log("calcGoldBurg");
    hideTron();
    ModelInit();

    var z = Math.cos(isoAngle);
    var r1 = Math.sin(isoAngle);
    var p0 = new tuple3d(0,0,1);
    isoPoints.push(p0);
    for(var i=0;i<5;++i) {
        var th1 = Math.PI*i*2/5.0;
        var p1 = new tuple3d(r1*Math.cos(th1), r1*Math.sin(th1), z);
        isoPoints.push(p1);
    }
    for(var i=0;i<5;++i) {
        var th1 = Math.PI*(i+0.5)*2/5.0;
        var p1 = new tuple3d(r1*Math.cos(th1), r1*Math.sin(th1), -1*z);
        isoPoints.push(p1);
    }
    var p9 = new tuple3d(0,0,-1);
    isoPoints.push(p9);
    
    var shortest = 99;
    for(var i=0;i<isoPoints.length;++i) {
        for(var j=i+1;j<isoPoints.length;++j) {
            var dis = isoPoints[i].dis2(isoPoints[j]);
            if (dis < shortest) {
                shortest = dis;
            }
            if (dis < 1.1*shortest) {
//addLine(isoPoints[i], isoPoints[j], 0x000000);
//console.log(i + " " + j + " dis=" + dis);
            }
        }
    }
    for(var i=0;i<isoPoints.length;++i) {
        var p = isoPoints[i].clone();
        for(var j=i+1;j<isoPoints.length;++j) {
            for(var k=j+1;k<isoPoints.length;++k) {
                if (p.dis2(isoPoints[j]) < shortest*1.01 &&
                        p.dis2(isoPoints[k]) < shortest*1.01 &&
                        isoPoints[j].dis2(isoPoints[k]) < shortest*1.01) {
                    var t1 = isoPoints[j].clone();
addTronLine(p, t1, 0xFF0000);
                    t1.sub(p);
                    var t2 = isoPoints[k].clone();
addTronLine(p, t2, 0x00FF00);
                    t2.sub(p);
                    addOneGoldBurgFace(p, t1, t2);
                }
            }
        }
    }
    drawTrons();
    drawViews();
}
