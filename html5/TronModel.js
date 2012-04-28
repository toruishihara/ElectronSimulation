// TronModel.js
// This code is model part of MVC pattarn
// This model has Electron position data and movement data.
// Position data is moving to next step by progress() method.

// Global variables
var Trons = new Array(); // Array of Electrons

function tron(in_th, in_sp, in_color)
{
	this.point = new tuple3d(1, in_th, in_sp);
	this.point.sp2xy();
	this.velo = new tuple3d(0,0,0); // Velocity
	this.color = in_color;
}

function AddTron(th, ph, color){
	var tr = new tron(th, ph, color);
	Trons.push(tr);
}

function ModelProgress() {
	for(var i=0;i<Trons.length;++i) {
		calcNewVelocityOne(i);
	}
	for(var i=0;i<Trons.length;++i) {
		progressOne(i);
	}
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
function progressOne(idx)
{
	var tron = Trons[idx];
	tron.point.add(tron.velo);
	tron.point.unify();
}
