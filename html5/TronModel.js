// TronModel.js
// This code is model part of MVC pattarn
// This model has Electron position data and movement data.
// Position data is moving to next step by progress() method.

// Global variables
var Trons = new Array(); // Array of Electrons
var Shake = 0.0;
//var TronsVelo = new Array(); // Trons' velocity

// static variables
var totalMove = 0;
var aveMove = 0;
var closestPair = "";
var closestAngle = 360;
var ShortestLength = 0.0;
var ShortestDot = 0.0;
var loneliestPair = "";
var loneliestAngle = 360;
var Angle21 = 360;
var Angle31 = 360;
var outputDone = 0;
var times = 0;
var initVelo = 0.01;
var ColombK = -0.001;
var totalEnergy = 0.0;

// defines
var huge = 9999999999;

// constructer
function tron(th, sp, color)
{
	this.point = new tuple3d(1, th, sp);
	this.point.sp2xy();
	this.velo = new tuple3d(0,0,0); // Velocity
	this.color = color;
}

function tronWithVelo(th, sp, color)
{
	this.point = new tuple3d(0, 0, 0);
	this.velo = new tuple3d(initVelo, th, sp); // Velocity
	this.velo.sp2xy();
	this.color = color;
}

// Public functions
function AddTron(th, ph, color){
	var tr = new tron(th, ph, color);
	Trons.push(tr);
}
function AddTronWithVelo(th, ph, color){
	var tr = new tronWithVelo(th, ph, color);
	Trons.push(tr);
}
function MoveTron(n, x, y, z){
	Trons[n].point.x = x;
	Trons[n].point.y = y;
	Trons[n].point.z = z;
	Trons[n].velo.x = 0;
	Trons[n].velo.y = 0;
	Trons[n].velo.z = 0;
}
function ModelInit() {
	Trons = new Array();
	outputDone = 0;
}
function ModelProgress() {
	for(var i=0;i<Trons.length;++i) {
		calcNewVelocityOne(i);
	}
    totalMove = 0;
    for(var i=0;i<Trons.length;++i) {
        totalMove += progressOne(i);
    }
	aveMove = totalMove/Trons.length;
    if (times % 50 == 0) {
        updateClosest();
        updateLoneliest();
    }
    if (times % 100 == 0) {
        updateAngles();
        updateEnergy();
    }
	times ++;
}

function updateAngles() {
	var diffDot12 = 0;
	var diffDot13 = 0;
	//console.log("updateAngle");
	for(var i=0;i<Trons.length;++i) {
		var maxDot = -1*huge;
		var maxDot2 = -1*huge;
		var maxDot3 = -1*huge;
		var maxJ = 0;
		var maxJ2 = 0;
		var maxJ3 = 0;
		var t0 = Trons[i].point;
		for(var j=0;j<Trons.length;++j) {
			if (i == j) continue;
			var dot = Trons[j].point.dot(t0);
			if (maxDot < dot) {
				maxDot = dot;
				maxJ = j;
				//console.log("angle1[" + i + "," + j + "]=" + 180*Math.acos(maxDot)/Math.PI);
			}
		}
		for(var j=0;j<Trons.length;++j) {
			if (i == j || j == maxJ) continue;
			var dot = Trons[j].point.dot(t0);
			if (maxDot2 < dot) {
				maxDot2 = dot;
				maxJ2 = j;
				//console.log("angle2[" + i + "," + j + "]=" + 180*Math.acos(maxDot2)/Math.PI);
			}
		}
		for(var j=0;j<Trons.length;++j) {
			if (i == j || j == maxJ || j == maxJ2) continue;
			var dot = Trons[j].point.dot(t0);
			if (maxDot3 < dot) {
				maxDot3 = dot;
				maxJ3 = j;
				//console.log("angle3[" + i + "," + j + "]=" + 180*Math.acos(maxDot3)/Math.PI);
			}
		}
		if (maxDot - maxDot2 > diffDot12) {
			diffDot12 = maxDot - maxDot2;
			Angle21 = 180*(Math.acos(maxDot2) - Math.acos(maxDot))/Math.PI;
		}
		if (maxDot - maxDot3 > diffDot13) {
			diffDot13 = maxDot - maxDot3;
			Angle31 = 180*(Math.acos(maxDot3) - Math.acos(maxDot))/Math.PI;
		}
	}
}

function updateEnergy() {
    totalEnergy = 0.0;
    for (var i = 0; i < Trons.length; ++i) {
        var pi = Trons[i].point;
        for (var j = i + 1; j < Trons.length; ++j) {
            var e = 1.0 / pi.dis(Trons[j].point);
            totalEnergy = totalEnergy + e;
        }
    }
}

function getEnergyOnTron(index) {
    var sum = 0.0;
    var pi = Trons[index].point;
    for (var j = 0; j < Trons.length; ++j) {
        if (j == index)
            continue;
        var e = 1.0 / pi.dis(Trons[j].point);
        sum = sum + e;
    }
    return sum;
}

function getEnergyOnPoint(p) {
    var sum = 0.0;
    for (var j = 0; j < Trons.length; ++j) {
        if (p.dis(Trons[j].point) < 0.0000000001)
            continue;
        var e = 1.0 / p.dis(Trons[j].point);
        sum = sum + e;
    }
    return sum;
}

function updateClosest() {
	// find closest pair
    var maxDot = -1*huge;
    var i0;
    var i1;
	for(var i=0;i<Trons.length;++i) {
		var ti = Trons[i].point;
		for(var j=0;j<Trons.length;++j) {
			if (i == j) continue;
			var dot = ti.dot(Trons[j].point);
			if (maxDot < dot) {
				maxDot = dot;
				closestPair = i.toFixed(0) + " and " + j.toFixed(0);
				i0 = i;
				i1 = j;
			}
		}
	}
	closestAngle = 180 * Math.acos(maxDot) / Math.PI;
	var p = Trons[i0].point.clone();
	p.sub(Trons[i1].point);
	ShortestLength = p.length();
	ShortestDot = Trons[i0].point.dot(Trons[i1].point);
}

function FindFreePoint() {
    return FindFreePointByEnergy();
}

function FindFreePointByEnergy() {
    var lowestEnergy = 9999999.9;
    var pi = Trons[0].point;
    // for 2point case, set retrun value something random
    var lowestPoint = new tuple3d(pi.y, pi.z, pi.x);
    for (var i = 0; i < Trons.length; ++i) {
        pi = Trons[i].point;
        for (var j = i + 1; j < Trons.length; ++j) {
            if (pi.dis(Trons[j].point) > 1.42 * ShortestLength)
                continue;
            var pj = Trons[j].point;
            for (var k = j + 1; k < Trons.length; ++k) {
                if (pi.dis(Trons[k].point) > 1.42 * ShortestLength)
                    continue;
                // p3 is middle point of pi,pj,pk
                var p3 = Trons[k].point.clone();
                p3.add(pj);
                p3.add(pi);
                p3.unify();
                var e = getEnergyOnPoint(p3);
                if (e < lowestEnergy) {
                    lowestPoint = p3.clone();
                    var pp = p3.clone();
                    p3.mul(TronThreeRadius);
                    //drawDot(p3, 0x000000, 2);
                    console.log("LowestE=%f", e);
                }
            }
        }
    }
    return lowestPoint;
}

function FindFreePointBy2DMesh() {
    var fine = 512.0; //1024.0;
	var minDot = 1.0;
    var size = 1;
	var freePoint = new tuple3d(0,0,0);
	for(var ph=0;ph<Math.PI;ph+=Math.PI/fine) {
        var thInc = Math.PI/(fine*Math.sin(ph));
		for( var th=0;th<2*Math.PI;th+=thInc) {
            //console.log("ph=" + ph + " th=" + th + " thi=" + thInc);
			var p = new tuple3d(1, th, ph);
			var closestIndex;
			var maxDot = -1.0;
            p.sp2xy();
            //var dot = drawDot(p, 0.0, 1);
			for(var i=0;i<Trons.length;++i) {
				var ti = Trons[i].point;
				var dot = ti.dot(p);
				if (dot > maxDot) {
					maxDot = dot;
					closestIndex = i;
					//console.log("closest=" + i + " dot=" + dot);
				}
			}
            if (minDot > maxDot) {
                minDot = maxDot;
                freePoint = p.clone();
                //console.log("dot=" + maxDot);
                size ++;
                //var dot2 = drawDot(p, 0.0, size);
            }
            //hideDot(dot);
		}
	}
    //var dot3 = drawDot(freePoint, 20.0, 20);
	return freePoint;
}

function FindNearestTronIndexFromIndex(idx)
{
    var maxDot = -1*huge;
    var ret = -1;
	for(var i=0;i<Trons.length;++i) {
        if (i == idx)   continue;
        var dot = Trons[idx].point.dot(Trons[i].point);
        if (maxDot < dot) {
            maxDot = dot;
            ret = i;
        }
    }
    return ret;
}

function updateLoneliest() {
	// find loneliest
	var lonelyDot = -1*huge;
	for(var i=0;i<Trons.length;++i) {
		var ti = Trons[i].point;
		var minDot = huge;
		var pair = "";
		for(var j=0;j<Trons.length;++j) {
			if (i == j) continue;
			var tj = Trons[j].point;
			var dot = Math.acos(ti.dot(tj));
			if (minDot > dot) {
				minDot = dot;
				pair = i.toFixed(0) + "," + j.toFixed(0);
			}
		}
		if (lonelyDot < minDot) {
			lonelyDot = minDot;
			loneliestPair = pair.concat("");
			loneliestAngle = 180*minDot/Math.PI;
		}
	}
}
function getAveMove() {
	return aveMove;
}
function TotalEnergy() {
    return totalEnergy;
}
function ClosestPair() {
	return closestPair;
}
function ClosestAngle() {
	return closestAngle;
}
function LoneliestPair() {
	return loneliestPair;
}
function LoneliestAngle() {
	return loneliestAngle;
}
function getAngle21() {
	return Angle21;
}
function getAngle31() {
	return Angle31;
}
function ModelMovePole() {
    return ModelMovePoleMaxEnergyTron();
    //return ModelMovePoleNextIndex();
}
function MovePointByBase(p, basePoint) {
	var tmpPoleZ = basePoint.clone();
	var tmpPoleY;
	var tmpPoleX;
	if (Math.abs(basePoint.z) > Math.abs(basePoint.x) && Math.abs(basePoint.z) > Math.abs(basePoint.y)) {
		if (basePoint.z > 0.0) {
			tmpPoleY = new tuple3d(0,1,0);
		} else {
			tmpPoleY = new tuple3d(0,-1,0);
		}
	} else if (Math.abs(basePoint.y) > Math.abs(basePoint.x) && Math.abs(basePoint.y) > Math.abs(basePoint.z)) {
		if (basePoint.y > 0.0) {
			tmpPoleY = new tuple3d(1,0,0);
		} else {
			tmpPoleY = new tuple3d(-1,0,0);
		}
	} else {
		if (basePoint.x > 0.0) {
			tmpPoleY = new tuple3d(0,0,1);
		} else {
			tmpPoleY = new tuple3d(0,0,-1);
		}
	}
	tmpPoleZ.unify();
	tmpPoleX = tmpPoleY.cross(tmpPoleZ);
	tmpPoleX.unify();
	tmpPoleY = tmpPoleZ.cross(tmpPoleX);
	
	var ret = new tuple3d(0,0,0);
	ret.x = p.dot(tmpPoleX);
	ret.y = p.dot(tmpPoleY);
	ret.z = p.dot(tmpPoleZ);
	return ret;
}

var PoleIndex = -1;
function ModelMovePoleNextIndex() {
    ModelMovePoleOnIndex(PoleIndex + 1);
}

function ModelMovePoleOnIndex(index) {
    PoleIndex = index;
    var nearIdx = FindNearestTronIndexFromIndex(index);
        
    var newPoleZ = Trons[index].point.clone();
	var newPoleY = newPoleZ.cross(Trons[nearIdx].point);
	newPoleY.unify();
	var newPoleX = newPoleY.cross(newPoleZ);
	
	for(var i=0;i<Trons.length;++i) {
		var p = Trons[i].point.clone();
		Trons[i].point.x = p.dot(newPoleX);
		Trons[i].point.y = p.dot(newPoleY);
		Trons[i].point.z = p.dot(newPoleZ);
		var v = Trons[i].velo.clone();
		Trons[i].velo.x = v.dot(newPoleX);
		Trons[i].velo.y = v.dot(newPoleY);
		Trons[i].velo.z = v.dot(newPoleZ);
	}
}

// Move the pole to less closest Tron. Typically center of pentagon
function ModelMovePoleMaxEnergyTron() {
    var maxEnergy = 0.0;
    var maxIndex = 0;
    for (var i = 0; i < Trons.length; ++i) {
        console.log("getEnergy i=%d", i);
        var e = getEnergyOnTron(i);
        console.log("i=%d e=%f", i, e);
        if (e > maxEnergy) {
            maxEnergy = e;
            maxIndex = i;
        }
    }
    ModelMovePoleOnIndex(maxIndex)
}

function ModelMovePoleLoneliest() {
    updateLoneliest();
	var ls = loneliestPair.split(',');
	var newPoleZ = Trons[ls[0]].point.clone();	
	var newPoleY = newPoleZ.cross(Trons[ls[1]].point);
	newPoleY.unify();
	var newPoleX = newPoleY.cross(newPoleZ);
	
	for(var i=0;i<Trons.length;++i) {
		var p = Trons[i].point.clone();
		Trons[i].point.x = p.dot(newPoleX);
		Trons[i].point.y = p.dot(newPoleY);
		Trons[i].point.z = p.dot(newPoleZ);
		var v = Trons[i].velo.clone();
		Trons[i].velo.x = v.dot(newPoleX);
		Trons[i].velo.y = v.dot(newPoleY);
		Trons[i].velo.z = v.dot(newPoleZ);
	}
}
function logJson() {
    var a1 = ClosestAngle().toFixed(6);
    var a2 = LoneliestAngle().toFixed(6);
	var a21 = Angle21.toFixed(6);
	var a31 = Angle31.toFixed(6);
    var ps = Array(Trons.length*3);
    var pv = Array(Trons.length*3);
    for(var i=0;i<Trons.length;++i) {
        ps[3*i+0] = Trons[i].point.x;
        ps[3*i+1] = Trons[i].point.y;
        ps[3*i+2] = Trons[i].point.z;
        pv[3*i+0] = Trons[i].velo.x;
        pv[3*i+1] = Trons[i].velo.y;
        pv[3*i+2] = Trons[i].velo.z;
    }
    var jsonObj = {num:Trons.length, vertex:ps, velocity:pv, angle1:a1, angle2:a2, angle21:a21, angle31:a31};
    var str = JSON.stringify(jsonObj);
    console.log(str);
    document.getElementById("result").innerText += str + "\n";
}
function logPoints() {
    //var fn = "~/tgit/Tron" + Trons.length + ".txt";
    var str = "N" + Trons.length + "=[";
    for(var i=0;i<Trons.length;++i) {
        var p = Trons[i].point.clone();
        str += p.x + "," + p.y + "," + p.z;
        if (i != Trons.length-1) {
            str += ", ";
        }
        console.log(str);
    }
    str += "]\n";
    console.log(str);
   // FileWrite(fn, str);

    var a1 = ClosestAngle().toFixed(6);
    var a2 = LoneliestAngle().toFixed(6);
    console.log("Ninfo" + Trons.length + "=" + a1 + "," + a2);
    str += "Ninfo" + Trons.length + "=" + a1 + "," + a2 + "\n";
    document.getElementById("result").innerText += str;
}

function save() {
	var text = outputSTL();
	location.href = 'data:application/octet-stream,'+encodeURIComponent(text);
}
function outputSTL() {
	var ret = "";
	ret = ret + "solid number" + Trons.length + "\n";
	for(var i=0;i<Trons.length;++i) {
		for(var j=i+1;j<Trons.length;++j) {
			for(var k=j+1;k<Trons.length;++k) {
				var p0 = Trons[i].point.clone();
				var p1 = Trons[j].point.clone();
				var p2 = Trons[k].point.clone();
				if (Math.acos(p0.dot(p1)) > 1.5*loneliestAngle*Math.PI/180) {
					//continue;
				} 
				if (Math.acos(p1.dot(p2)) > 1.5*loneliestAngle*Math.PI/180) {
					//continue;
				} 
				var p0b = p0.clone();
				var p1b = p1.clone();
				var p2b = p2.clone();

				var t1 = p1.clone();
				t1.sub(p0);
				var t2 = p2.clone();
				t2.sub(p0);

				// normal
				p0b.mul(1/3);
				p1b.mul(1/3);
				p2b.mul(1/3);
				p0b.add(p1b);
				p0b.add(p2b);
				var n = t1.cross(t2);
				n.unify();
				if (p0b.dot(n) < 0.0) {
					n.mul(-1);
					var tmp = p2.clone();
					p2 = p1.clone();
					p1 = tmp.clone();
				}
				
				ret = ret + "facet normal " + n.x.toExponential()
				 	+ " " + n.y.toExponential()
				 	+ " " + n.z.toExponential();
				ret = ret + "outer loop\n";
				ret = ret + "vertex " + p0.x.toExponential()
				 	+ " " + p0.y.toExponential()
				 	+ " " + p0.z.toExponential() + "\n";
				ret = ret + "vertex " + p1.x.toExponential()
				 	+ " " + p1.y.toExponential()
				 	+ " " + p1.z.toExponential() + "\n";
				ret = ret + "vertex " + p2.x.toExponential()
				 	+ " " + p2.y.toExponential()
				 	+ " " + p2.z.toExponential() + "\n";
				ret = ret + "endloop\n";
				ret = ret + "endfacet\n";
			}
		}
	}
	ret = ret + "endsolid number" + Trons.length + "\n";
	return ret;
}

function calcNewVelocityOne(idx)
{
	var tron = Trons[idx];
	var newVelo = new tuple3d(0,0,0);
	for(var i=0;i<Trons.length;++i) {
		if (i == idx)	continue;
		var d = Trons[i].point.clone();
		d.sub(tron.point);
		var len2 = d.length2();
		if (len2 < 0.0000001) {
			len2 = 0.0000001;
		}
        
		var len = Math.sqrt(len2);
		d.mul(ColombK/(len*len2));

		//d.mul(ColombK / len2);

		newVelo.add(d);
	}
	tron.velo = newVelo;
    /*
    //if (r.length2() > 1.0) {
		r.unify();
		rComp = r.dot(newVelo);
		r.setLength(rComp);
		newVelo.sub(r);
	//}
	tron.velo.add(newVelo);
    */
}

// return moving distance
function progressOne(idx)
{
	var oldTron = Trons[idx].point.clone();
	var tron = Trons[idx];
    var len;
    var shakeV;

	tron.point.add(tron.velo);

	//tron.point.unify();
	tron.point.inSphere();

    	//shakeV = new tuple3d(Shake*len*(Math.random()-0.5), Shake*len*(Math.random()-0.5), Shake*len*(Math.random()-0.5));
    	//tron.point.add(shakeV);
	oldTron.sub(tron.point);
	len = oldTron.length();
    return len;
}

function _sleep(millisec){
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while( d2 < d1 + millisec ){
        d2=new Date().getTime();
    }
    return;
}

// find closest normal
function findTronFromNormal(n) {
    var dot = -1.0;
    var idx = 0;
	for(var i=0;i<Trons.length;++i) {
        var d = Trons[i].point.dot(n);
        if (d > 0.99999) {
            console.log("findTron return i=" + i);
            return i;
        }
        if (d > dot) {
            dot = d;
            idx = i;
        }
    }
    console.log("findTron return i=" + i + " dot=" + dot);
    return idx;
}
