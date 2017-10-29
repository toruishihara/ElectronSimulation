var Is60 = 0;
var StoryLimit = 0.0000001;
var story_tour_cnt = 0;

function storyLoop()
{
    //console.log("phase=" + phase + " cnt=" + calc_cnt + " cnt2=" + story_tour_cnt);
    var wait = 0;
    if (phase == 0) {
        calc_cnt++;
	    hideEdge();
        ModelProgress();
        updateThree(TronThreeRadius);
        if (Edge) {
            drawEdge();
        }
        if (Face) {
            drawFace();
        }
        drawMapView();
        drawInfos();
        if (NumTrons == 32 || NumTrons == 72 || NumTrons == 132 || NumTrons == 192) {
            if (getAveMove() < CriticalLimit && calc_cnt > 300) {
                phase = 1;
            }
        } else {
            if (getAveMove() < RegularLimit && calc_cnt > 300) {
                phase = 1;
            }
        }
    } else {
        if (story_tour_cnt == 0) {
            hideTron();

            //ModelMovePole();
            drawTrons();
            if (Edge) {
                drawEdge();
            }
            if (Face) {
                drawFace();
            }
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
        
        updateCamera(new tuple3d(ViewCenter.x * TronThreeRadius, ViewCenter.y * TronThreeRadius, ViewCenter.z * TronThreeRadius));
        if (story_tour_cnt > LoopNum) {
            logJson();
            hideEdge();
            calc_cnt = 0;
            story_tour_cnt = 0;
            phase = 0;
            hideTron();
            //clearMapView();
            //ModelInit();
			if (Is60) {
				for (var i=0;i<60;++i) {
            		NumTrons ++;
            		var color = new tronColor("hsl", (NumTrons*47)%360, "100%", "50%");
            		launchTron(color);
				}
			} else {
            	NumTrons ++;
            	var color = new tronColor("hsl", (NumTrons*47)%360, "100%", "50%");
            	launchTron(color);
			}

            drawTrons();
        }
            
    }
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);

    if (Looping) {
    	window.requestAnimationFrame(storyLoop);
    }
}

function quickLoop()
{
    //console.log("phase=" + phase + " cnt=" + calc_cnt + " cnt2=" + story_tour_cnt);
    var wait = 0;
    if (phase == 0) {
        calc_cnt++;
        var str = "N=" + NumTrons;
        document.getElementById("underDesc").innerText = str;
        ModelProgress();
	    if (calc_cnt % 20 <= 20) {
            hideEdge();
            updateThree(TronThreeRadius);
            if (Edge) {
                drawEdge();
            }
            if (Face) {
                drawFace();
            }
            drawMapView();
            drawInfos();
	    }
        if (TotalMove() < Limit && calc_cnt > 100) {
            phase = 1;
        }
	if (calc_cnt > 1000) {
        phase = 1;
        hideEdge();
        hideTron();
	    readJsonAndMove(NumTrons);
        drawTrons();
        if (Edge) {
            drawEdge();
        }
        if (Face) {
            drawFace();
        }
	    _sleep(500);
	}
    } else {
        if (story_tour_cnt == 0) {
            hideTron();

            //ModelMovePole();
            drawTrons();
            if (Edge) {
                drawEdge();
            }
            if (Face) {
                drawFace();
            }
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
	    updateCamera(new tuple3d(ViewCenter.x * TronThreeRadius, ViewCenter.y * TronThreeRadius, ViewCenter.z * TronThreeRadius));
	}
        if (story_tour_cnt > LoopNum) {
            logJson();
            hideEdge();
            calc_cnt = 0;
            story_tour_cnt = 0;
            phase = 0;
            hideTron();
            //clearMapView();
            //ModelInit();
            NumTrons ++;
            //addTronsOnModel();
            var color = new tronColor("hsl", (NumTrons*47)%360, "100%", "50%");
            launchTron(color);

            drawTrons();
        }
            
    }
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);

    if (Looping) {
    	window.requestAnimationFrame(quickLoop);
    }
}

function story() {
	//var fs = require('fs');
//fs.writeFile("/tmp/test", "Hey there!", function(err) {
    //if(err) {
    //    console.log(err);
    //} else {
    //    console.log("The file was saved!");
    //}
//}); 

    return storyCleanStart();
}

function StoryContinue() {
    NumTrons = Trons.length;
    console.log("n=" + NumTrons);
    drawTrons();
    drawViews();

    Looping = true;
    Limit = StoryLimit;
    storyLoop();
}

function StoryContinue60() {
	Is60 = 1;
	StoryContinue();
}

function storyCleanStart() {
    // tmp for 6 story
    NumTrons = 2;
    init();
    
    hideTron();
    ModelInit();
    addTronsOnModel();

    // tmp for 6 story
    //var color = new tronColor("hsl", (0*47)%360, "100%", "50%");
    //AddTron(0.0, 0.0, color);
    //var color2 = new tronColor("hsl", (1*47)%360, "100%", "50%");
    //AddTron(0.0, Math.PI, color2);

    drawTrons();
    drawViews();

    Looping = true;
    Limit = StoryLimit;
    storyLoop();
}

function StoryQuickStart() {
    NumTrons = 2;
    init();
    
    hideTron();
    ModelInit();

    var color = new tronColor("hsl", (0*47)%360, "100%", "50%");
    AddTron(0.0, 0.0, color);
    var color2 = new tronColor("hsl", (1*47)%360, "100%", "50%");
    AddTron(0.0, Math.PI, color2);

    drawTrons();
    drawViews();

    Looping = true;
    Limit = StoryLimit;
    quickLoop();
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
