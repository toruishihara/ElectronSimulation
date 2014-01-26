var FacePoints = new Array();       // Used for drawing line
var FaceTris = new Array();

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
    var dupCheck = new Array(128*128*128);
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
                        if (dupCheck[idx] == 1) {
	                        console.log("SKIPP" + "i=" + idx);
                            //continue;
                        }
                        dupCheck[idx] = 1;
                        // above is not perfect code for floating xyz values

                        FacePoints.push(ps);
						drawDot(ps, 0x000000, 2);
						addTriangle(p01, p0, ps);
						addTriangle(p0, p20, ps);
						addTriangle(p1, p01, ps);
						addTriangle(p12, p1, ps);
						addTriangle(p2, p12, ps);
						addTriangle(p20, p2, ps);
//return;
					}
				}
           	}
       	}
	}
    if (ShowFaceEdge == 1) {
        var shortest = 999999.9;
        for(i=0;i<FacePoints.length;++i) {
            var p0 = FacePoints[i].clone();
            for(j=i+1;j<FacePoints.length;++j) {
                var p1 = FacePoints[j].clone();
                var dis = p0.dis(p1);
                if (dis < shortest) {
                    shortest = dis;
                }
            }
        }
        for(i=0;i<FacePoints.length;++i) {
            var p0 = FacePoints[i].clone();
            for(j=i+1;j<FacePoints.length;++j) {
                var p1 = FacePoints[j].clone();
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
    if (LogFaceToJson == 1) {
        var fp = Array(Trons.length*3);
        var vp = Array(FacePoints.length*3);
        for(var i=0;i<Trons.length;++i) {
            fp[3*i+0] = Trons[i].point.x;
            fp[3*i+1] = Trons[i].point.y;
            fp[3*i+2] = Trons[i].point.z;
        }
        for(var i=0;i<FacePoints.length;++i) {
            vp[3*i+0] = FacePoints[i].x;
            vp[3*i+1] = FacePoints[i].y;
            vp[3*i+2] = FacePoints[i].z;
        }
        // sort by z
        var sw;
        for(var i=0;i<Trons.length;++i) {
            for(var j=i+1;j<Trons.length;++j) {
                if (fp[3*i+2] < fp[3*j+2]) {
                    sw = fp[3*i+0];
                    fp[3*i+0] = fp[3*j+0];
                    fp[3*j+0] = sw;
                    sw = fp[3*i+1];
                    fp[3*i+1] = fp[3*j+1];
                    fp[3*j+1] = sw;
                    sw = fp[3*i+2];
                    fp[3*i+2] = fp[3*j+2];
                    fp[3*j+2] = sw;
                }
            }
        }
        for(var i=0;i<FacePoints.length;++i) {
            for(var j=i+1;j<FacePoints.length;++j) {
                if (vp[3*i+2] < vp[3*j+2]) {
                    sw = vp[3*i+0];
                    vp[3*i+0] = vp[3*j+0];
                    vp[3*j+0] = sw;
                    sw = vp[3*i+1];
                    vp[3*i+1] = vp[3*j+1];
                    vp[3*j+1] = sw;
                    sw = vp[3*i+2];
                    vp[3*i+2] = vp[3*j+2];
                    vp[3*j+2] = sw;
                }
            }
        }
        //var jsonObj = {num:Trons.length, face:fp, vertex:vp};
        //var str = JSON.stringify(jsonObj);
        //console.log(str);
        //document.getElementById("result").innerText += str + "\n";
    }
}
function addTriangle(p0, p1, p2)
{
	drawTriangle(p0, p1, p2);
	FaceTris.push(new tri3d(p0, p1, p2));
}
function writeFaceSTL()
{
	var i;
	var n;
	var str = "soild face" + FaceTris.length + "\n";
	for(i=0;i<FaceTris.length;++i) {
		str = "";
		var revese;
		n = FaceTris[i].p0.cross(FaceTris[i].p1);
		n.unify();
		if (n.dot(FaceTris[i].p0) < 0.0) {
			n.mul(-1.0);
			reverse = 1;
		} else {
			reverse = 0;
		}
		
		str += "facet normal " + n.x  + " " + n.y + " " + n.z + "\n";
		str += "  outer loop\n";
		if (reverse == 0) {
			str += "    vertex " + FaceTris[i].p0.x + " " + FaceTris[i].p0.y + " " + FaceTris[i].p0.z + "\n";
			str += "    vertex " + FaceTris[i].p1.x + " " + FaceTris[i].p1.y + " " + FaceTris[i].p1.z + "\n";
			str += "    vertex " + FaceTris[i].p2.x + " " + FaceTris[i].p2.y + " " + FaceTris[i].p2.z + "\n";
		} else {
			str += "    vertex " + FaceTris[i].p2.x + " " + FaceTris[i].p2.y + " " + FaceTris[i].p2.z + "\n";
			str += "    vertex " + FaceTris[i].p1.x + " " + FaceTris[i].p1.y + " " + FaceTris[i].p1.z + "\n";
			str += "    vertex " + FaceTris[i].p0.x + " " + FaceTris[i].p0.y + " " + FaceTris[i].p0.z + "\n";
		}
		str += "  endloop\n";
		str += "endfacet\n";
		document.getElementById("result").innerText += str;
	}
	document.getElementById("result").innerText += "endsolid face" + FaceTris.length + "\n";
}

function writeSVG() {
	var north = new tuple3d(0,0,1);
	var i;
	var str = "<svg height=\"500\" width=\"500\">\n  <polygon points=\"";
	var prev = 0;
	for(i=0;i<FacePoints.length;++i) {
		var dis = north.dis(FacePoints[i]);
		if (dis < 0.3) {
			if (prev) {
				str += " ";
			}
			str += (250 + FacePoints[i].x*200).toString();
			str += ",";
			str += (250 + FacePoints[i].y*200).toString();
			prev = 1;
		}
	}
	str += "\" style=\"stroke:black;stroke-width:1\" />\n</svg>";
    document.getElementById("result").innerText += str + "\n";
}
