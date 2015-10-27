var container;
var camera, controls, scene, renderer;
var stats, statsWidget;

var currentPlayer;
var playMesh;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.y = 1;
	camera.position.z = 5;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x86877F, 0.2);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1);
	scene.add(light);

	light = new THREE.DirectionalLight(0x002288);
	light.position.set(-1, -1, -1);
	scene.add(light);

	light = new THREE.AmbientLight(0x222222);
	scene.add(light);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container = document.getElementById('container');
	container.appendChild(renderer.domElement);
	
	statsWidget = new Stats();
	statsWidget.setMode(0);
	stats = document.getElementById('stats');
	stats.appendChild(statsWidget.domElement);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	// controls.addEventListener( 'change', render );
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;

	var texture = THREE.ImageUtils.loadTexture("img/ground.jpg");
	texture.wrapS = THREE.MirroredRepeatWrapping;
	texture.wrapT = THREE.MirroredRepeatWrapping;
	texture.repeat.set(16, 16);

	var material = new THREE.MeshBasicMaterial({
		map: texture,
		side: THREE.DoubleSide
	});
	var floorGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
	var floor = new THREE.Mesh(floorGeometry, material);
	floor.rotateX(Math.PI / 2);
	floor.position.y = 0;
	scene.add(floor);

	initSoundCloud();
	addPlayerButtons();
	addTombstone(10);

	window.addEventListener('resize', onWindowResize, false);
}

function initSoundCloud() {
	SC.initialize({
		client_id: '4be5f67fb3f99bbf86796c7a713b124b'
	});

	SC.stream('/tracks/173324934').then(function(player) {
		currentPlayer = player;
	}).catch(function() {
		console.log(arguments);
	});
}

function addPlayerButtons()
{
	var playTexture = new THREE.ImageUtils.loadTexture("img/play.png");
	playTexture.wrapS = THREE.RepeatWrapping;
	playTexture.wrapT = THREE.RepeatWrapping;
	playTexture.repeat.set(1, 1);

	var playGeom = new THREE.CubeGeometry( 2, 2, 2 );
	var playMat = new THREE.MeshBasicMaterial( {map: playTexture} );
	playMesh = new THREE.Mesh(playGeom, playMat);
	playMesh.position.y = 5;
	scene.add(playMesh);
}

function addTombstone(amount) {
	var tombstone = new THREE.Shape();
	var texture = THREE.ImageUtils.loadTexture("img/granite.jpg");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 1);

	tombstone.moveTo(0, 0, 0);
	tombstone.lineTo(0, 2, 0);
	tombstone.bezierCurveTo(0.2, 2.5, 1.3, 2.5, 1.5, 2);
	tombstone.lineTo(1.5, 0, 0);

	var extrudeSettings = {
		amount: 0,
		curveSegments: 100,
		bevelEnabled: true,
		bevelSegments: 5,
		steps: 5,
		bevelSize: 0.05,
		bevelThickness: 0.1
	};

	for (var i = 0; i < amount; i++) {
		for (var j = 0; j < amount; j++) {
			var geometry = new THREE.ExtrudeGeometry(tombstone, extrudeSettings);
			var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
				map: texture
			}));
			mesh.position.x = i * 5 - amount * 2;
			mesh.position.z = j * 5 - amount * 2;
			scene.add(mesh);
		}
	}
}

function animate() {
	requestAnimationFrame(animate);

	playMesh.rotation.x += 0.01;
	playMesh.rotation.y += 0.01;
	controls.update();
	
	render();
	statsWidget.update();
}

function render()
{
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	animate();
}