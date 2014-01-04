var tour_t = 0;
function TourStart() {
    Edge = document.getElementById('Edge').checked;
    Face = document.getElementById('Face').checked;
    if (Edge) {
       drawEdge();
    }
    if (Face) {
        drawFace();
    }
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
    Renderer.clear();
    Renderer.render(ThreeScene, ThreeCamera);
    
    if (tour_t < LoopNum) {
        window.requestAnimationFrame(tourLoop);
    }
}

