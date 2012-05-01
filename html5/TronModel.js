// TronModel.js
// This code is model part of MVC pattarn
// This model has Electron position data and movement data.
// Position data is moving to next step by progress() method.

// Global variables
var Trons = new Array(); // Array of Electrons

// static variables
var totalMove = 0;
var closestPair = "";
var closestAngle = 360;
var loneliestPair = "";
var loneliestAngle = 360;
var outputDone = 0;
var times = 0;

// defines
var huge = 9999999999;

// struct
function tron(th, sp, color)
{
	this.point = new tuple3d(1, th, sp);
	this.point.sp2xy();
	this.velo = new tuple3d(0,0,0); // Velocity
	this.color = color;
}

// Public functions
function AddTron(th, ph, color){
	var tr = new tron(th, ph, color);
	Trons.push(tr);
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
	times ++;
	if (times > 1000 && totalMove < 0.00001 && outputDone == 0) {
		outputSTL();
		outputDone = 1;
	}

	// find closest pair
	var minDot = huge;
	for(var i=0;i<Trons.length;++i) {
		var ti = Trons[i].point;
		for(var j=0;j<Trons.length;++j) {
			if (i == j) continue;
			var tj = Trons[j].point;
			var dot = Math.acos(ti.dot(tj));
			if (minDot > dot) {
				minDot = dot;
				closestPair = i.toFixed(0) + " and " + j.toFixed(0);
			}
		}
	}
	closestAngle = 180*minDot/Math.PI;

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
				pair = i.toFixed(0) + " and " + j.toFixed(0);
			}
		}
		if (lonelyDot < minDot) {
			lonelyDot = minDot;
			loneliestPair = pair.concat("");
			loneliestAngle = 180*minDot/Math.PI;
		}
	}
}
function TotalMove() {
	return totalMove;
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
function outputSTL() {
	console.log("#solid number" + Trons.length);
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
				
				console.log("#facet normal " + n.x.toExponential()
				 	+ " " + n.y.toExponential()
				 	+ " " + n.z.toExponential() );
				console.log("#outer loop");
				console.log("#vertex " + p0.x.toExponential()
				 	+ " " + p0.y.toExponential()
				 	+ " " + p0.z.toExponential() );
				console.log("#vertex " + p1.x.toExponential()
				 	+ " " + p1.y.toExponential()
				 	+ " " + p1.z.toExponential() );
				console.log("#vertex " + p2.x.toExponential()
				 	+ " " + p2.y.toExponential()
				 	+ " " + p2.z.toExponential() );
				console.log("#endloop");
				console.log("#endfacet");
			}
		}
	}
	console.log("#endsolid number" + Trons.length);
}

var ColombK = -0.00001;
function calcNewVelocityOne(idx)
{
	var tron = Trons[idx];
	var newVelo = new tuple3d(0,0,0);
	for(var i=0;i<Trons.length;++i) {
		if (i == idx)	continue;
		var d = Trons[i].point.clone();
		d.sub(tron.point);
		var len2 = d.length2();
		if (len2 < 0.0000001) continue;
		var len = d.length();
		d.unify();
		d.mul(ColombK/len2);
		newVelo.add(d);
	}
	var r = tron.point.clone();
	r.unify();
	rComp = r.dot(newVelo);
	r.setLength(rComp);
	newVelo.sub(r);
	tron.velo.add(newVelo);
}
// return moving distance
function progressOne(idx)
{
	var oldTron = Trons[idx].point.clone();
	var tron = Trons[idx];

	tron.point.add(tron.velo);
	tron.point.unify();
	oldTron.sub(tron.point);
	return oldTron.length();
}
