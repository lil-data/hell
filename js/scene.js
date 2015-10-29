// Scene
var container, camera, controls, scene, renderer;

// Stats
var stats, statsWidget;

// Player
var currentPlayer, playMesh, isPlaying;

// Mouse
var mouse = new THREE.Vector2(),
	mouseDown = new THREE.Vector2();
var mouseRay = new THREE.Raycaster(),
	mouseDownRay = new THREE.Raycaster();

// Particles
var particles, parameters, color, pMaterials = [];

// Glitch
var composer, glitchPass;

// Lava
var clock = new THREE.Clock();
var lavaUniforms, lavaMaterial, lavaMesh;

// Lights
var light1, light2, light3, light4;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 2;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x1D1D1C, 0.5);

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
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;

	initSoundCloud();
	addPlayerButtons();
	hellSprites();
	// singleTombstone();
	groundIsLava();
	addText("HALLOWEEN 2015");
	// addTombstones(10);
	// groundIsWorms();

	composer = new THREE.EffectComposer(renderer);
	composer.addPass(new THREE.RenderPass(scene, camera));
	addGlitchPass();

	addLights();

	window.addEventListener('resize', onWindowResize, false);
}

function addLights()
{

	var ambientLight = new THREE.AmbientLight( 0x000000 );
	scene.add( ambientLight );

	// var sphere = new THREE.SphereGeometry( 0.1, 16, 16 );

	// light1 = new THREE.PointLight( 0xffffff, 100, 50 );
	// // light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
	// scene.add( light1 );

	// light2 = new THREE.PointLight( 0x0040ff, 2, 50 );
	// // light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
	// scene.add( light2 );

	// light3 = new THREE.PointLight( 0x80ff80, 2, 50 );
	// // light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
	// scene.add( light3 );

	// light4 = new THREE.PointLight( 0xffaa00, 2, 50 );
	// // light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
	// scene.add( light4 );

	var lights = [];
	lights[0] = new THREE.PointLight( 0xffffff, 100, 0 );
	lights[1] = new THREE.PointLight( 0xffffff, 100, 0 );
	lights[2] = new THREE.PointLight( 0xffffff, 100, 0 );

	lights[0].position.set( 0, 200, 0 );
	lights[1].position.set( 100, 200, 100 );
	lights[2].position.set( -100, -200, -100 );

	scene.add( lights[0] );
	scene.add( lights[1] );
	scene.add( lights[2] );

}

function groundIsWorms() {
	var texture = THREE.ImageUtils.loadTexture("textures/worms.jpg");
	texture.wrapS = THREE.MirroredRepeatWrapping;
	texture.wrapT = THREE.MirroredRepeatWrapping;
	texture.repeat.set(64, 64);

	var material = new THREE.MeshBasicMaterial({
		map: texture,
		color: 0xff0000,
		side: THREE.DoubleSide
	});
	var floorGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
	var floor = new THREE.Mesh(floorGeometry, material);
	floor.rotateX(Math.PI / 2);
	floor.position.y = 0;
	scene.add(floor);
}

function groundIsLava() {
	lavaUniforms = {
		fogDensity: {
			type: "f",
			value: 0.45
		},
		fogColor: {
			type: "v3",
			value: new THREE.Vector3(0, 0, 0)
		},
		time: {
			type: "f",
			value: 1.0
		},
		resolution: {
			type: "v2",
			value: new THREE.Vector2(10, 10)
		},
		uvScale: {
			type: "v2",
			// value: new THREE.Vector2(20, 20)
			value: new THREE.Vector2(10, 10)
		},
		texture1: {
			type: "t",
			value: THREE.ImageUtils.loadTexture("textures/lava/cloud.png")
		},
		texture2: {
			type: "t",
			value: THREE.ImageUtils.loadTexture("textures/lava/lavatile2.jpg")
		}
	};

	lavaUniforms.texture1.value.wrapS = lavaUniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	lavaUniforms.texture2.value.wrapS = lavaUniforms.texture2.value.wrapT = THREE.RepeatWrapping;

	var size = 0.65;

	lavaMaterial = new THREE.ShaderMaterial({

		uniforms: lavaUniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		side: THREE.DoubleSide

	});

	// var geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
	var geometry = new THREE.SphereGeometry(5, 50, 50);
	lavaMesh = new THREE.Mesh(geometry, lavaMaterial);
	lavaMesh.rotateX((Math.PI / 2) + 0.75);
	lavaMesh.rotateZ(Math.PI);
	lavaMesh.position.y = 1;
	lavaMesh.position.z = 2.5;
	scene.add(lavaMesh);
}

function addGlitchPass() {
	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = true;
	composer.addPass(glitchPass);
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

function hellSprites() {

	var geometry = new THREE.Geometry();
	pent = THREE.ImageUtils.loadTexture("textures/pent.png");

	for (i = 0; i < 1000; i++) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 2000 - 1000;
		vertex.z = Math.random() * 2000 - 1000;

		geometry.vertices.push(vertex);

	}

	parameters = [
		[
			[1.0, 0.0, 0], pent, 20
		],
		[
			[1.0, 0.0, 0], pent, 15
		],
		[
			[1.0, 0.0, 0], pent, 10
		],
		[
			[1.0, 0.0, 0], pent, 8
		],
		[
			[1.0, 0.0, 0], pent, 5
		]
	];

	for (i = 0; i < parameters.length; i++) {

		color = parameters[i][0];
		sprite = parameters[i][1];
		size = parameters[i][2];

		pMaterials[i] = new THREE.PointsMaterial({
			color: 0xff0000,
			size: size,
			map: sprite,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		});
		pMaterials[i].color.setHSL(color[0], color[1], color[2]);

		particles = new THREE.Points(geometry, pMaterials[i]);

		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;

		scene.add(particles);

	}
}

function addText(text) {
	var geometry = new THREE.TextGeometry(text, {
		size: 1,
		height: 0.2,
		curveSegments: 20,
		font: "Mensch",
		bevelEnabled: false
	});
	geometry.computeBoundingBox();

	var material = new THREE.MeshBasicMaterial({
		color: 0xff0000
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = -0.8;
	mesh.position.y = 0;
	mesh.position.z = 1;
	mesh.scale.x = 0.15;
	mesh.scale.y = 0.05;
	mesh.scale.z = 0.15;
	scene.add(mesh);
}

function addPlayerButtons() {
	var playTexture = new THREE.ImageUtils.loadTexture("textures/play.png");
	playTexture.wrapS = THREE.RepeatWrapping;
	playTexture.wrapT = THREE.RepeatWrapping;
	playTexture.repeat.set(1, 1);

	var playGeom = new THREE.CubeGeometry(2, 2, 2);
	var playMat = new THREE.MeshBasicMaterial({
		map: playTexture,
		transparent: true,
		opacity: 0.5,
		color: 0xFFFFFF
	});
	playMesh = new THREE.Mesh(playGeom, playMat);
	playMesh.position.y = 0;
	playMesh.scale.x = 0.5;
	playMesh.scale.y = 0.5;
	playMesh.scale.z = 0.5;
	playMesh.name = "PlayButton";
	scene.add(playMesh);
}

function singleTombstone(amount) {
	var tombstone = new THREE.Shape();
	var texture = THREE.ImageUtils.loadTexture("textures/shell.jpg");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(0.5, 0.5);

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

	var geometry = new THREE.ExtrudeGeometry(tombstone, extrudeSettings);
	var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
		map: texture,
		color: 0xff0000
	}));
	mesh.position.x = 0;
	mesh.position.z = 0;
	mesh.scale.x = 1.5;
	mesh.scale.y = 1.5;
	mesh.scale.z = 1.5;
	scene.add(mesh);
}

function addTombstones(amount) {
	var tombstone = new THREE.Shape();
	var texture = THREE.ImageUtils.loadTexture("textures/shell.jpg");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(0.1, 0.1);

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
			// var mesh = new THREE.Mesh(geometry, lavaMaterial);
			var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
				map: texture,
				color: 0xff0000
			}));
			mesh.position.x = i * 5 - amount * 2;
			mesh.position.z = j * 5 - amount * 2;
			scene.add(mesh);
		}
	}
}

function onMouseMove(event) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	mouseRay.setFromCamera(mouse, camera);

	//checkForMouseMoveCollisions();

}

function checkForMouseMoveCollisions() {
	var intersects = mouseRay.intersectObjects(scene.children);

	for (var i = 0; i < intersects.length; i++) {
		// do something...
	}
}

function onMouseDown(event) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouseDown.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouseDown.y = -(event.clientY / window.innerHeight) * 2 + 1;
	mouseDownRay.setFromCamera(mouseDown, camera);

	checkMouseDownCollisions();

}

function checkMouseDownCollisions() {
	var intersects = mouseDownRay.intersectObjects(scene.children);

	for (var i = 0; i < intersects.length; i++) {
		if (intersects[i].object.name == "PlayButton") {
			if (currentPlayer) {
				if (!isPlaying) {
					isPlaying = true;
					currentPlayer.play();
					intersects[i].object.material.color.set(0xff0000);
				} else {
					isPlaying = false;
					currentPlayer.pause();
					intersects[i].object.material.color.set(0xff00ff);
				}
			}
		}
	}
}

function animate() {
	requestAnimationFrame(animate);

	var time = Date.now();

	playMesh.rotation.x += 0.01;
	playMesh.rotation.y += 0.01;
	controls.update();
	updatePoints();
	updateLava();
	// updateLights();
	composer.render();
	// render();
	statsWidget.update();
}

function render() {
	renderer.render(scene, camera);
}

function updateLights()
{
	var time = Date.now() * 0.0005;

	// light1.position.x = Math.sin( time * 0.7 ) * 3;
	// light1.position.y = Math.cos( time * 0.5 ) * 4;
	// light1.position.z = Math.cos( time * 0.3 ) * 3;

	light2.position.x = Math.cos( time * 0.3 ) * 3;
	light2.position.y = Math.sin( time * 0.5 ) * 4;
	light2.position.z = Math.sin( time * 0.7 ) * 3;

	light3.position.x = Math.sin( time * 0.7 ) * 3;
	light3.position.y = Math.cos( time * 0.3 ) * 4;
	light3.position.z = Math.sin( time * 0.5 ) * 3;

	light4.position.x = Math.sin( time * 0.3 ) * 3;
	light4.position.y = Math.cos( time * 0.7 ) * 4;
	light4.position.z = Math.sin( time * 0.5 ) * 3;
}

function updateLava()
{
	var delta = 5 * clock.getDelta();

	lavaUniforms.time.value += 0.2 * delta;

	// lavaMesh.rotation.x += 0.05 * delta;
	// lavaMesh.rotation.y += 0.0125 * delta;

}

function updatePoints() {
	var time = Date.now() * 0.00005;

	for (i = 0; i < scene.children.length; i++) {
		var object = scene.children[i];

		if (object instanceof THREE.Points) {
			object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
		}
	}

	for (i = 0; i < pMaterials.length; i++) {
		color = parameters[i][0];

		h = (360 * (color[0] + time) % 360) / 360;
		// pMaterials[i].color.setHSL(h, color[1], color[2]);
		pMaterials[i].color.set(0xff0000);
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	animate();
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);