
import com.sun.j3d.utils.geometry.*;
import com.sun.j3d.utils.universe.*;
import javax.media.j3d.*;
import javax.vecmath.*;
import java.io.File;
import java.io.FileWriter;
import java.io.BufferedWriter;
import java.io.PrintWriter;
import java.io.IOException;

public class densi {
	public int id;
	public Primitive obj = new Sphere(0.1f);
    public Color3f col = new Color3f(1.8f, 0.1f, 0.1f);
    public Point3d loc = new Point3d();
    //public Vector3d vel = new Vector3d();
    private double mVelTh_x = 0;
    private double mVelPhi_x = 0;
    private double mVelTh_y = 0;
    private double mVelPhi_y = 0;
    private double mVelTh_z = 0;
    private double mVelPhi_z = 0;
    private double k = 0.001;
    private Point3d center = new Point3d();
    public TransformGroup trans = new TransformGroup();

    private PrintWriter mPW;
    
    public void init(){
		//try {
	    	//File file = new File("densi_"+id+".csv");
			//mPW = new PrintWriter(new BufferedWriter(new FileWriter(file)));
			//mPW.println("#x,y,z,th,phi,vel_th,vel_phi");
		//} catch (IOException e) {
			//e.printStackTrace();
		//}
    	
    	trans.setCapability(TransformGroup.ALLOW_TRANSFORM_WRITE);
    	//Sphere sphere = new Sphere(0.1f);
    	//trans.addChild(sphere);
    	Appearance appearance = new Appearance();
    	Material material = new Material();
    	if (id%6 == 0)
    		material.setDiffuseColor(0.1f,0.1f,0.9f);
    	else if (id%6 == 1)
     		material.setDiffuseColor(0.1f,0.9f,0.1f);
    	else if (id%6 == 2)
     		material.setDiffuseColor(0.9f,0.1f,0.1f);
    	else if (id%6 == 3)
     		material.setDiffuseColor(0.9f,0.9f,0.1f);
    	else if (id%6 == 4)
     		material.setDiffuseColor(0.1f,0.9f,0.9f);
    	else if (id%6 == 5)
     		material.setDiffuseColor(0.9f,0.9f,0.9f);
    	appearance.setMaterial(material);
    	Box box = new Box(0.02f, 0.02f, 0.02f, appearance);
    	trans.addChild(box);
    }
    
    public void setLoc(double x, double y, double z){
    	loc.x = x;
    	loc.y = y;
    	loc.z = z;
    	double r = loc.distance(center);
    	loc.scale(1.0/r);
    	Transform3D pos1 = new Transform3D();
    	pos1.setTranslation(new Vector3d(loc.x, loc.y, loc.z));
    	trans.setTransform(pos1);
    }
    
    public void setColor(Color3f c) {
    	col = c;
    }
    
    public void progress(double t)
    {
    	Point3d old = new Point3d(loc);

    	double phi = Math.acos(loc.z);
    	double th = Math.atan2(loc.y,loc.x);
    	Vector3d r1 = new Vector3d(Math.cos(th)*Math.sin(phi), Math.sin(th)*Math.sin(phi), Math.cos(phi));
    	Vector3d phi1 = new Vector3d(Math.cos(th)*Math.cos(phi), Math.sin(th)*Math.cos(phi), -1*Math.sin(phi));
    	Vector3d th1 = new Vector3d(-1*Math.sin(th), Math.cos(th), 0);
    	//System.out.println("len1="+r1.length() + " len2="+th1.length() + " len3=" + phi1.length());
    	//System.out.println("dot1="+r1.dot(th1) + " dot2="+th1.dot(phi1)+" dot3="+phi1.dot(r1));
    	Vector3d v_z = new Vector3d();
    	Vector3d th2 = new Vector3d(th1);
    	Vector3d phi2 = new Vector3d(phi1);
    	th2.scale(t*mVelTh_z);
    	phi2.scale(t*mVelPhi_z);
    	v_z.add(th2);
    	v_z.add(phi2);

    	double phi_y = Math.acos(loc.y);
    	double th_y = Math.atan2(loc.x, loc.z);
    	Vector3d r1_y = new Vector3d(Math.cos(th_y)*Math.sin(phi_y), Math.sin(th_y)*Math.sin(phi_y), Math.cos(phi_y));
    	Vector3d phi1_y = new Vector3d(Math.cos(th_y)*Math.cos(phi_y), Math.sin(th_y)*Math.cos(phi_y), -1*Math.sin(phi_y));
    	Vector3d th1_y = new Vector3d(-1*Math.sin(th_y), Math.cos(th_y), 0);
    	//System.out.println("len1="+r1.length() + " len2="+th1.length() + " len3=" + phi1.length());
    	//System.out.println("dot1="+r1.dot(th1) + " dot2="+th1.dot(phi1)+" dot3="+phi1.dot(r1));
    	Vector3d v_y = new Vector3d();
    	Vector3d th2_y = new Vector3d(th1_y);
    	Vector3d phi2_y = new Vector3d(phi1_y);
    	th2_y.scale(t*mVelTh_y);
    	phi2_y.scale(t*mVelPhi_y);
    	v_y.add(th2_y);
    	v_y.add(phi2_y);

    	double phi_x = Math.acos(loc.x);
    	double th_x = Math.atan2(loc.z, loc.y);
    	Vector3d r1_x = new Vector3d(Math.cos(th_x)*Math.sin(phi_x), Math.sin(th_x)*Math.sin(phi_x), Math.cos(phi_x));
    	Vector3d phi1_x = new Vector3d(Math.cos(th_x)*Math.cos(phi_x), Math.sin(th_x)*Math.cos(phi_x), -1*Math.sin(phi_x));
    	Vector3d th1_x = new Vector3d(-1*Math.sin(th_x), Math.cos(th_x), 0);
    	//System.out.println("len1="+r1.length() + " len2="+th1.length() + " len3=" + phi1.length());
    	//System.out.println("dot1="+r1.dot(th1) + " dot2="+th1.dot(phi1)+" dot3="+phi1.dot(r1));
    	Vector3d v_x = new Vector3d();
    	Vector3d th2_x = new Vector3d(th1_x);
    	Vector3d phi2_x = new Vector3d(phi1_x);
    	th2_x.scale(t*mVelTh_x);
    	phi2_x.scale(t*mVelPhi_x);
    	v_x.add(th2_x);
    	v_x.add(phi2_x);
    	
    	// select best 2 v
    	double dot_x_y = v_x.dot(v_y);
    	double dot_y_z = v_y.dot(v_z);
    	double dot_z_x = v_z.dot(v_x);
    	Vector3d v = new Vector3d();
    	if (dot_x_y > dot_y_z && dot_x_y > dot_z_x) {
    		v = v_x;
    		v.add(v_y);
    		v.scale(0.5);
    	} else if (dot_y_z > dot_z_x) {
    		v = v_y;
    		v.add(v_z);
    		v.scale(0.5);
    	} else {
    		v = v_z;
    		v.add(v_x);
    		v.scale(0.5);
    	}
    	
    	Vector3d d1 = new Vector3d();
    	Vector3d d2 = new Vector3d();
    	loc.add(v);
    	d1.sub(loc, old);
    	double r = loc.distance(center);
    	loc.scale(1.0/r);
    	setLoc(loc.x, loc.y, loc.z);
    	d2.sub(loc, old);
    	if (mPW != null) {
    		mPW.println(old.x +","+ old.y + ","+old.z+","+th+","+phi+","+mVelTh_z+","+mVelPhi_z+","+d1.length()+","+d2.length());
    	}
    }
    public void calcCoulomb(densi d){
    	double r2 = loc.distanceSquared(d.loc);
    	if (r2 < 0.00000000000001) {
    		System.out.println("Too close");
    		r2 = 0.00000000000001;
    	}
    	
    	Vector3d diff = new Vector3d();
    	diff.sub(loc, d.loc);
    	//System.out.println(id + ": diff=" + diff.length() + " r2=" + r2);
    	diff.normalize();
    	diff.scale(k/r2);
    	//System.out.println(id + ": diff=" + diff.length() + " r3=" + loc.distance(center) );

    	// convert to Z axis polar coordination
    	double phi = Math.acos(loc.z);
    	double th = Math.atan2(loc.y,loc.x);
    	Vector3d r1 = new Vector3d(Math.cos(th)*Math.sin(phi), Math.sin(th)*Math.sin(phi), Math.cos(phi));
    	Vector3d phi1 = new Vector3d(Math.cos(th)*Math.cos(phi), Math.sin(th)*Math.cos(phi), -1*Math.sin(phi));
    	Vector3d th1 = new Vector3d(-1*Math.sin(th), Math.cos(th), 0);
    	mVelTh_z += diff.dot(th1);
    	mVelPhi_z += diff.dot(phi1);
    	
    	// convert to Y axis polar coordination
    	double phi_y = Math.acos(loc.y);
    	double th_y = Math.atan2(loc.x, loc.z);
    	Vector3d r1_y = new Vector3d(Math.cos(th_y)*Math.sin(phi_y), Math.sin(th_y)*Math.sin(phi_y), Math.cos(phi_y));
    	Vector3d phi1_y = new Vector3d(Math.cos(th_y)*Math.cos(phi_y), Math.sin(th_y)*Math.cos(phi_y), -1*Math.sin(phi_y));
    	Vector3d th1_y = new Vector3d(-1*Math.sin(th_y), Math.cos(th_y), 0);
    	mVelTh_y += diff.dot(th1_y);
    	mVelPhi_y += diff.dot(phi1_y);
    	
    	// convert to X axis polar coordination
    	double phi_x = Math.acos(loc.x);
    	double th_x = Math.atan2(loc.z, loc.y);
    	Vector3d r1_x = new Vector3d(Math.cos(th_x)*Math.sin(phi_x), Math.sin(th_x)*Math.sin(phi_x), Math.cos(phi_x));
    	Vector3d phi1_x = new Vector3d(Math.cos(th_x)*Math.cos(phi_x), Math.sin(th_x)*Math.cos(phi_x), -1*Math.sin(phi_x));
    	Vector3d th1_x = new Vector3d(-1*Math.sin(th_x), Math.cos(th_x), 0);
    	mVelTh_x += diff.dot(th1_x);
    	mVelPhi_x += diff.dot(phi1_x);
    	//double VelR = diff.dot(r1);
    	
    	//System.out.println(id + ": Vr=" + VelR + " Vth=" + mVelTh + " vPh=" + mVelPhi);
    }
}
