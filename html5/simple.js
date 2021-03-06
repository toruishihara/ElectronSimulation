function onLoad() {
	var ThreeCanvas = document.getElementById("ThreeCanvas");
	var width = ThreeCanvas.clientWidth;
	var height = ThreeCanvas.clientHeight;  
	var ThreeRenderer = new THREE.WebGLRenderer({antialias: true});
	ThreeRenderer.setSize(width, height );
	ThreeCanvas.appendChild(ThreeRenderer.domElement);
	ThreeRenderer.setClearColorHex(0xFFFFFF, 1.0);

	var ThreeScene = new THREE.Scene();

	var light = new THREE.PointLight(0xFFFFFF, 1.0, 0);
	light.position.set( 100, 100, 200 );
	ThreeScene.add(light);
	var ambientLight = new THREE.AmbientLight(0x888888);
	ThreeScene.add(ambientLight);

	var ThreeCamera = new THREE.PerspectiveCamera( 45 , width / height , 1 , 10000 );
	ThreeScene.add(ThreeCamera);
	ThreeCamera.position.x = 100;
	ThreeCamera.position.y = 150;
	ThreeCamera.position.z = 500;

	var col = 0xff0000;
  	var mat = new THREE.MeshLambertMaterial({ color:col, ambient:col, opacity:1.0 });
	var box = new THREE.Mesh(new THREE.CubeGeometry(100,100,100), mat);
	ThreeScene.add(box);
	box.position.set(0,0,0);	
	
	ThreeRenderer.clear();
	ThreeRenderer.render(ThreeScene, ThreeCamera);
}
