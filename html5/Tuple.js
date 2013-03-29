/* 3D framework class */
// Triangle data
function tri3d(in_x0, in_y0, in_z0, in_x1, in_y1, in_z1, in_x2, in_y2, in_z2){
	this.p0 = new tuple3d(in_x0, in_y0, in_z0);
	this.p1 = new tuple3d(in_x1, in_y1, in_z1);
	this.p2 = new tuple3d(in_x2, in_y2, in_z2);
}
// Line data
function line3d(in_x0, in_y0, in_z0, in_x1, in_y1, in_z1){
	this.p0 = new tuple3d(in_x0, in_y0, in_z0);
	this.p1 = new tuple3d(in_x1, in_y1, in_z1);
}

// tuple, can be 3D point, 3D vector, or 3D Spherical Polar Coordinates
function tuple3d(in_x, in_y, in_z){
	this.x = in_x;
	this.y = in_y;
	this.z = in_z;
	this.dot = tuple3d_dot;
	this.unify = tuple3d_unify;
	this.inSphere = tuple3d_inSphere;
	this.setLength = tuple3d_setLength;
	this.cross = tuple3d_cross;
	this.mul = tuple3d_mul;
	this.add = tuple3d_add;
	this.sub = tuple3d_sub;
	this.length = tuple3d_length;
	this.length2 = tuple3d_length2;
    	this.dis = tuple3d_dis;
    	this.dis2 = tuple3d_dis2;
	this.xy2sp = tuple3d_xy2sp;
	this.sp2xy = tuple3d_sp2xy;
	this.xy2spy = tuple3d_xy2spy;
	this.spy2xy = tuple3d_spy2xy;
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
function tuple3d_inSphere() {
	var len2 = this.x*this.x + this.y*this.y + this.z*this.z;
	var len = Math.sqrt(len2);
    	if (len > 1.0) {
       		this.x = this.x / len;
        	this.y = this.y / len;
        	this.z = this.z / len;
    	}
}
function tuple3d_setLength(newLength) {
	var len2 = this.x*this.x + this.y*this.y + this.z*this.z;
	var len = Math.sqrt(len2);
	this.x *= newLength / len;
	this.y *= newLength / len;
	this.z *= newLength / len;
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
function tuple3d_length() {
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
}
function tuple3d_length2() {
	return this.x*this.x + this.y*this.y + this.z*this.z;
}
function tuple3d_dis(tuple) {
    var dx = this.x - tuple.x;
    var dy = this.y - tuple.y;
    var dz = this.z - tuple.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}
function tuple3d_dis2(tuple) {
    var dx = this.x - tuple.x;
    var dy = this.y - tuple.y;
    var dz = this.z - tuple.z;
    return dx*dx + dy*dy + dz*dz;
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
	var th = Math.atan2(this.y,this.x);
	var ph;
	if (r < 0.0000001) {
		ph = 0;
	} else {
		ph = Math.acos(this.z/r);
	}
	this.x = r;
	this.y = th;
	this.z = ph;
}
function tuple3d_spy2xy() {
	var r = this.x;
	var th = this.y;
	var ph = this.z;
	this.z = r*Math.cos(th)*Math.sin(ph);
	this.x = r*Math.sin(th)*Math.sin(ph);
	this.y = r*Math.cos(ph);
}
function tuple3d_xy2spy() {
	var r = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	var th = Math.atan2(this.x,this.z);
	var ph;
	if (r < 0.0000001) {
		ph = 0;
	} else {
		ph = Math.acos(this.y/r);
	}
	this.x = r;
	this.y = th;
	this.z = ph;
}

function tuple3d_log() {
	console.log(" x=" + this.x + " y=" + this.y + " z=" + this.z);
}
function tuple3d_log(str) {
	console.log(str + " x=" + this.x + " y=" + this.y + " z=" + this.z);
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

/* end of 3D framework class */
