
import java.applet.Applet;
import java.awt.*;
import java.awt.event.*;
import java.lang.Math;
import java.util.Random;

import com.sun.j3d.utils.applet.MainFrame;
import com.sun.j3d.utils.universe.*;
import javax.media.j3d.*;
import javax.vecmath.*;
import com.sun.j3d.utils.geometry.Sphere;
import javax.swing.Timer;

public class DensiBa extends Applet implements ActionListener, KeyListener {
    private Button go = new Button("Go");
    private final int cnt = 12;
    private final float mProgress = 0.001f;
    private final int mProgMax = 40000;
    //private TransformGroup objTrans[] = new TransformGroup[cnt];
    //private Transform3D trans = new Transform3D();
    private Timer timer;
    private SimpleUniverse mUniv;
    private Canvas3D mCanvas;
    //private Transform3D mLookat;// = new Transform3D();
    private Point3d mEye;
    private Point3d mCenter;
    private Vector3d mUp;
    private int mPcnt = 0;
   // private Vector3f vp;
    private densi densis[] = new densi[cnt];
    
 public BranchGroup createSceneGraph() {
    	// Create the root of the branch graph
    	BranchGroup objRoot = new BranchGroup();
    	Appearance appearance = new Appearance();
    	Material material = new Material();
    	material.setDiffuseColor(0.1f,0.1f,0.1f);
    	TransparencyAttributes attr=new TransparencyAttributes();
    	attr.setTransparency(0.1f);
    	appearance.setTransparencyAttributes(attr);
    	appearance.setMaterial(material);
    	Sphere sphere = new Sphere(0.99f, appearance);
    	objRoot.addChild(sphere);
    	
	    for (int i=0;i<cnt;++i) {
	    	densis[i] = new densi();
	    	densis[i].id = i;
	    	densis[i].init();
	    	densis[i].setLoc(Math.random(), Math.random(), 1);
	    	//densis[i].setLoc(1, -0.1 + 0.2*i, 0);
	    	objRoot.addChild(densis[i].trans);
	    }
	    
		Point3d[] pts = new Point3d[48];
		Point3d[] pts2 = new Point3d[24];

		for(int i=0;i<12;++i) {
			double th = Math.PI*i/12.0;
			for(int j=0;j<24;++j) {
				double phi1 = 2*Math.PI*j/24.0;
				double phi2 = 2*Math.PI*(j+1)/24.0;
				pts[2*j] = new Point3d(Math.sin(th)*Math.cos(phi1), Math.sin(th)*Math.sin(phi1), Math.cos(th));
				pts[2*j+1] = new Point3d(Math.sin(th)*Math.cos(phi2), Math.sin(th)*Math.sin(phi2), Math.cos(th));
			}
			LineArray geometry = new LineArray(48, 
					GeometryArray.COORDINATES | GeometryArray.COLOR_3);
			geometry.setCoordinates(0, pts);
			for(int j=0;j<48;++j) {
				geometry.setColor(j, new Color3f(Color.white));
			}
			Shape3D shape = new Shape3D(geometry);
			objRoot.addChild(shape);
		}
		
		for(int i=0;i<24;++i) {
			double phi = 2*Math.PI*i/24.0;
			for(int j=0;j<12;++j) {
				double th1 = Math.PI*j/12.0;
				double th2 = Math.PI*(j+1)/12.0;
				pts2[2*j] = new Point3d(Math.sin(th1)*Math.cos(phi), Math.sin(th1)*Math.sin(phi), Math.cos(th1));
				pts2[2*j+1] = new Point3d(Math.sin(th2)*Math.cos(phi), Math.sin(th2)*Math.sin(phi), Math.cos(th2));
			}
			LineArray geometry = new LineArray(24, 
					GeometryArray.COORDINATES | GeometryArray.COLOR_3);
			geometry.setCoordinates(0, pts2);
			for(int j=0;j<24;++j) {
				geometry.setColor(j, new Color3f(Color.white));
			}
			Shape3D shape = new Shape3D(geometry);
			objRoot.addChild(shape);
		}
	    
    BoundingSphere bounds =
        new BoundingSphere(new Point3d(0.0,0.0,0.0), 100.0);
    Color3f light1Color = new Color3f(1.0f, 1.0f, 1.0f);
    Vector3f light1Direction  = new Vector3f(4.0f, -7.0f, -12.0f);
    DirectionalLight light1
      = new DirectionalLight(light1Color, light1Direction);
    light1.setInfluencingBounds(bounds);
    objRoot.addChild(light1);
     // Set up the ambient light

	Color3f ambientColor = new Color3f(0.0f, 0.0f, 0.0f);
	AmbientLight ambientLightNode = new AmbientLight(ambientColor);
	ambientLightNode.setInfluencingBounds(bounds);
	objRoot.addChild(ambientLightNode);
    return objRoot;
}
public DensiBa() {
    setLayout(new BorderLayout());
    GraphicsConfiguration config =
        SimpleUniverse.getPreferredConfiguration();
    mCanvas = new Canvas3D(config);
    add("Center", mCanvas);
    mCanvas.addKeyListener(this);
    timer = new Timer(100,this);
    //timer.start();
    Panel p =new Panel();
    p.add(go);
    add("North",p);
    go.addActionListener(this);
    go.addKeyListener(this);
    // Create a simple scene and attach it to the virtual universe
    BranchGroup scene = createSceneGraph();
    mUniv = new SimpleUniverse(mCanvas);
    //u.getViewingPlatform().setNominalViewingTransform();
    
    /*
    ViewingPlatform vplt = univ.getViewingPlatform();
    TransformGroup viewpoint = vplt.getViewPlatformTransform();
    Transform3D trns = new Transform3D();
    vp = new Vector3f(0, 0, 5);
    trns.setTranslation(vp);
    viewpoint.setTransform(trns);
*/
    
    Transform3D pers = new Transform3D();
    Transform3D lookat = new Transform3D();
    //mUniv = new SimpleUniverse(mCanvas);
    lookat.set(Transform3D.ZERO);
    pers.set(Transform3D.ZERO);
    mEye = new Point3d(0.0, 0.0, 2.0);
    mCenter = new Point3d(0.0,0.0,0.0);
    mUp = new Vector3d(0.0,1.0,0.0);
    lookat.lookAt(mEye, mCenter, mUp);
    pers.perspective(Math.toRadians(90.0), 1.0, 0.01, 100.0);
    mCanvas.getView().setWindowEyepointPolicy(View.RELATIVE_TO_COEXISTENCE);
    mCanvas.getView().setProjectionPolicy(View.PERSPECTIVE_PROJECTION);
    mCanvas.getView().setCompatibilityModeEnable(true);
    mCanvas.getView().setVpcToEc(lookat);
    mCanvas.setMonoscopicViewPolicy(View.LEFT_EYE_VIEW);
    mCanvas.getView().setLeftProjection(pers);
    mCanvas.getView().setScreenScalePolicy(View.SCALE_SCREEN_SIZE);   
    
    mUniv.addBranchGraph(scene);
}

public void actionPerformed(ActionEvent e ) {
    // start timer when button is pressed
	//System.out.println(e);
	if (e.getSource()==go){
            if (!timer.isRunning()) {
                timer.start();
            }
            return;
	}
	if(mPcnt == 1000) {
		System.out.println("break");
	}
	if(mPcnt++ < mProgMax) {
        for(int i=0;i<cnt;++i) {
        	for(int j=0;j<cnt;++j) {
        		if (i != j) {
        			densis[i].calcCoulomb(densis[j]);
        		}
        	}
        }
        for(int i=0;i<cnt;++i) {
        	densis[i].progress(mProgress);
        }
	} else{
		System.out.println("End");
	}
}
public static void main(String[] args) {
    System.out.println("Program Started");
    DensiBa bb = new DensiBa();
    bb.addKeyListener(bb);
    MainFrame mf = new MainFrame(bb, 640, 640);
}
@Override
public void keyPressed(KeyEvent e) {
	System.out.println("keycode="+e.getKeyCode() + " keychar="+e.getKeyChar());
	Transform3D trn = new Transform3D();
	if (e.getKeyCode() == KeyEvent.VK_UP){
		trn.rotY(-0.1);
	}
	if (e.getKeyCode() == KeyEvent.VK_DOWN){
		trn.rotY(0.1);
	}
	if (e.getKeyCode() == KeyEvent.VK_LEFT){
		trn.rotX(-0.1);
	}
	if (e.getKeyCode() == KeyEvent.VK_RIGHT){
		trn.rotX(0.1);
	}
	trn.transform(mEye);
	Transform3D lookat = new Transform3D();
    lookat.lookAt(mEye, mCenter, mUp);

    mCanvas.getView().setVpcToEc(lookat);
}
@Override
public void keyReleased(KeyEvent arg0) {
	// TODO Auto-generated method stub
	
}
@Override
public void keyTyped(KeyEvent arg0) {
	// TODO Auto-generated method stub
	
} 
}
