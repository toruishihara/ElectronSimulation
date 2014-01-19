function drawFace_old() {
	var t;
	t = createTriangle(-100,-100,-100, -100,100,100, -100,100,-100, 0x00FF00);
    ThreeScene.add(t);
	t = createTriangle(-100,-100,-100, -100,100,100, -100,-100,100, 0x00FF00);
    ThreeScene.add(t);
	t = createTriangle(100,-100,-100, 100,100,100, 100,100,-100, 0x00FF00);
    ThreeScene.add(t);
	t = createTriangle(100,-100,-100, 100,100,100, 100,-100,100, 0x00FF00);
    ThreeScene.add(t);

	t = createTriangle(-100,100,-100, 100,100,100, 100,100,-100, 0xFFFF00);
    ThreeScene.add(t);
	t = createTriangle(-100,100,-100, 100,100,100, -100,100,100, 0xFFFF00);
    ThreeScene.add(t);
	t = createTriangle(-100,-100,-100, 100,-100,100, 100,-100,-100, 0xFFFF00);
    ThreeScene.add(t);
	t = createTriangle(-100,-100,-100, 100,-100,100, -100,-100,100, 0xFFFF00);
    ThreeScene.add(t);

	t = createTriangle(-100,-100,100, 100,100,100, 100,-100,100, 0xFF00FF);
    ThreeScene.add(t);
	t = createTriangle(-100,-100,100, 100,100,100, -100,100,100, 0xFF00FF);
    ThreeScene.add(t);
	t = createTriangle(-100,-100,-100, 100,100,-100, 100,-100,-100, 0xFF00FF);
    ThreeScene.add(t);
	t = createTriangle(-100,-100,-100, 100,100,-100, -100,100,-100, 0xFF00FF);
    ThreeScene.add(t);
}

function testLogPoint(p,str) {
    console.log(str + "[" + p.x + "," + p.y + "," + p.z + "]");
}
function testAdjustPoint(p) {
if (p.x > 0.9999) { p.x = 1.0;}
if (p.x < -0.9999) { p.x = -1.0;}
if (p.y > 0.9999) { p.y = 1.0;}
if (p.y < -0.9999) { p.y = -1.0;}
if (p.z > 0.9999) { p.z = 1.0;}
if (p.z < -0.9999) { p.z = -1.0;}
if (Math.abs(p.x) < 0.0001) {p.x = 0.0;}
if (Math.abs(p.y) < 0.0001) {p.y = 0.0;}
if (Math.abs(p.z) < 0.0001) {p.z = 0.0;}
return p;
}

function drawFace() {
    var facePoints = new Array(128*128*128);
    var realFacePoints = new Array();       // Used for drawing line
	// Find shortest pair
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
	var cnt = 0;
	for(var i=0; i < Trons.length; ++i ) {
       	var p0 = Trons[i].point.clone();
		//addLine(CenterPoint, p0, 0xFF0000);
       	for(var j=i+1; j < Trons.length; ++j ) {
       		var p1 = Trons[j].point.clone();
			//addLine(CenterPoint, p1, 0xFFFF00);
       		var dis01 = p0.dis(p1);
       		if (dis01 < shortest*1.5 && dis01 > 0.00001) {
       			for(var k=j+1; k < Trons.length; ++k ) {
       				var p2 = Trons[k].point.clone();
					//addLine(CenterPoint, p2, 0x0000FF);
       				var dis02 = p0.dis(p2);
       				var dis12 = p1.dis(p2);
					if (dis02 < shortest*1.5 && dis12 < shortest*1.5) {
						var p01 = p0.clone();
						p01.add(p1);
						if (p01.length2() < 0.00001) {
							continue;
						}
						p01.unify();
						p01.setLength(1/p01.dot(p0));
						var cr01 = p0.cross(p1);
						var cr12 = p1.cross(p2);

						var p12 = p1.clone();
						p12.add(p2);
						if (p12.length2() < 0.00001) {
							continue;
						}
						p12.unify();
						p12.setLength(1/p12.dot(p1));

						var p20 = p2.clone();
						p20.add(p0);
						if (p20.length2() < 0.00001) {
							continue;
						}

						p20.unify();
						p20.setLength(1/p20.dot(p2));

						cr01 = p0.cross(p1);
						cr01.unify();
						cr12 = p1.cross(p2);
						cr12.unify();
						if (cr01.dot(cr12) > 0.9999) {
							continue; //parallel
						}

						var d0112 = p12.clone();
						d0112.sub(p01);

						// http://d.hatena.ne.jp/obelisk2/20101228/1293521247
						var s = d0112.dot(cr01) - d0112.dot(cr12)*cr01.dot(cr12);
						s /= (1.0 - cr01.dot(cr12)*cr01.dot(cr12));

						var ps = p01.clone();
						cr01.mul(s);
						ps.add(cr01);
                        // if already has same point, skip it. Happens on square case 
						var pn = ps.clone();
                        pn.unify();
                        var idx = Math.floor(pn.x*63) + 64;
                        idx *= 128;
                        idx += Math.floor(pn.y*63) + 64;
                        idx *= 128;
                        idx += Math.floor(pn.z*63) + 64;
	                    console.log("x=" + ps.x + " y=" + ps.y + " z=" + ps.z + " i="+idx);
                        if (facePoints[idx] == 1) {
	                        console.log("SKIPP" + "i=" + idx);
                            //continue;
                        }
                        facePoints[idx] = 1;
                        // above is not perfect code for floating xyz values

                        realFacePoints.push(ps);
						drawDot(ps, 0x000000, 2);
						drawTriangle(p01, p0, ps);
						drawTriangle(p0, p20, ps);
						drawTriangle(p1, p01, ps);
						drawTriangle(p12, p1, ps);
						drawTriangle(p2, p12, ps);
						drawTriangle(p20, p2, ps);
//return;
					}
				}
           	}
       	}
	}
    if (ShowFaceEdge == 1) {
        var shortest = 999999.9;
        for(i=0;i<realFacePoints.length;++i) {
            var p0 = realFacePoints[i].clone();
            for(j=i+1;j<realFacePoints.length;++j) {
                var p1 = realFacePoints[j].clone();
                var dis = p0.dis(p1);
                if (dis < shortest) {
                    shortest = dis;
                }
            }
        }
        for(i=0;i<realFacePoints.length;++i) {
            var p0 = realFacePoints[i].clone();
            for(j=i+1;j<realFacePoints.length;++j) {
                var p1 = realFacePoints[j].clone();
                var dis = p0.dis(p1);
                if (dis > shortest*2.0 && dis > 0.25) {
                    continue;
                }
			    addLine(p0, p1, 0x000000);
                var cyl = createCylinder(p0, p1, 2, 0x000000);
                ThreeScene.add(cyl);
            }
        }
    }
} 
