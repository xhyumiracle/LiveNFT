//THREEJS RELATED VARIABLES 

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  gobalLight, shadowLight, backLight,
  renderer,
  container,
  controls;

// OTHER VARIABLES

var PI = Math.PI;
var hero;
var clock;
var container;
var gui = new dat.GUI();

// MATERIALS

var blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
    shading:THREE.FlatShading,
  });
  
var orangeMat = new THREE.MeshPhongMaterial({
    color: 0xb44b39,
    shininess:0,
    shading:THREE.FlatShading,
  });

  var lightOrangeMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
    shading:THREE.FlatShading,
  });
  
  var whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789, 
    shading:THREE.FlatShading,
  });


// CUSTOMIZABLE PARAMETERS

var parameters = {
  speed:6,
  
  pawFRAmplitudeY:4,
  pawFRAmplitudeZ:8,
  pawFRCycleOffset:.2,
  pawFRAnkleRotationAmplitude:PI/2,
  
  pawFLAmplitudeY:4,
  pawFLAmplitudeZ:8,
  pawFLCycleOffset:-.2,
  pawFLAnkleRotationAmplitude:PI/2,
  
  pawBRAmplitudeY:4,
  pawBRAmplitudeZ:5,
  pawBRCycleOffset:-.1 + PI,
  pawBRAnkleRotationAmplitude:PI/2,
  
  pawBLAmplitudeY:4,
  pawBLAmplitudeZ:5,
  pawBLCycleOffset:.1 - PI,
  pawBLAnkleRotationAmplitude:PI/2,
  
  bodyYAmplitude:4,
  bodyCycleOffset:-PI/2,
  bodyRotationAmplitude:PI*.12,
  
  torsoYAmplitude:2,
  torsoCycleOffset:-PI/2,
  torsoRotationAmplitude:PI*.12,
  
  tailRotationAmplitude:PI/3,
  tailCycleOffset:PI/2,
  
  headYAmplitude:3,
  headZAmplitude:4,
  headCycleOffset:-PI/2,
  headRotationAmplitude:PI/8,
  
  mouthRotationAmplitude:.6,
  mouthCycleOffset:PI,
  
  earRightRotationAmplitude:.8,
  earRightCycleOffset:-PI/2 + .2,
  
  earLeftRotationAmplitude:.6,
  earLeftCycleOffset:-PI/2,
  
  eyeMinScale:.1,
  eyeMaxScale:1,
  eyeCycleOffset:-Math.PI/4,
}

function initGUI(){
  
  gui.width = 250;
  gui.add(parameters, 'speed').min(0).max(20).step(1).name('Cycle speed');
  
  var fr = gui.addFolder('Front Right');
  fr.add(parameters, 'pawFRCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  fr.add(parameters, 'pawFRAmplitudeY').min(0).max(12).step(.1).name('Leg Amp Y');
  fr.add(parameters, 'pawFRAmplitudeZ').min(0).max(12).step(.1).name('Leg Amp Z');
  fr.add(parameters, 'pawFRAnkleRotationAmplitude').min(0).max(PI).step(0.01).name('Ankle Amp');
  //fr.open();
  
  var fl = gui.addFolder('Front Left');
  fl.add(parameters, 'pawFLCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  fl.add(parameters, 'pawFLAmplitudeY').min(0).max(12).step(.1).name('Leg Amp Y');
  fl.add(parameters, 'pawFLAmplitudeZ').min(0).max(12).step(.1).name('Leg Amp Z');
  fl.add(parameters, 'pawFLAnkleRotationAmplitude').min(0).max(PI).step(0.01).name('Ankle Amp');
  //fl.open();
  
  var br = gui.addFolder('Back Right');
  br.add(parameters, 'pawBRCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  br.add(parameters, 'pawBRAmplitudeY').min(0).max(12).step(.1).name('Leg Amp Y');
  br.add(parameters, 'pawBRAmplitudeZ').min(0).max(12).step(.1).name('Leg Amp Z');
  br.add(parameters, 'pawBRAnkleRotationAmplitude').min(0).max(PI).step(0.01).name('Ankle Amp');
  //br.open();
  
  var bl = gui.addFolder('Back Left');
  bl.add(parameters, 'pawBLCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  bl.add(parameters, 'pawBLAmplitudeY').min(0).max(12).step(.1).name('Leg Amp Y');
  bl.add(parameters, 'pawBLAmplitudeZ').min(0).max(12).step(.1).name('Leg Amp Z');
  bl.add(parameters, 'pawBLAnkleRotationAmplitude').min(0).max(PI).step(0.01).name('Ankle Amp');
  //bl.open();
  
  var bdy = gui.addFolder('Body');
  bdy.add(parameters, 'bodyCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  bdy.add(parameters, 'bodyYAmplitude').min(0).max(5).step(.1).name('Y Amp');
  bdy.add(parameters, 'bodyRotationAmplitude').min(0).max(PI).step(0.01).name('Rotation Amp');
  //bdy.open();
  
  var trso = gui.addFolder('Torso');
  trso.add(parameters, 'torsoCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  trso.add(parameters, 'torsoYAmplitude').min(0).max(5).step(.1).name('Y Amp');
  trso.add(parameters, 'torsoRotationAmplitude').min(0).max(PI).step(0.01).name('Rotation Amp');
  //trso.open();
  
  var tail = gui.addFolder('Tail');
  tail.add(parameters, 'tailCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  tail.add(parameters, 'tailRotationAmplitude').min(0).max(PI).step(0.01).name('Rotation Amp');
  //tail.open();
  
  var mouth = gui.addFolder('Mouth');
  mouth.add(parameters, 'mouthCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  mouth.add(parameters, 'mouthRotationAmplitude').min(0).max(PI).step(0.01).name('Rotation Amp');
  //mouth.open();
  
  
  var head = gui.addFolder('Head');
  head.add(parameters, 'headCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  head.add(parameters, 'headYAmplitude').min(0).max(5).step(.1).name('Y Amp');
  head.add(parameters, 'headZAmplitude').min(0).max(5).step(.1).name('Z Amp');
  head.add(parameters, 'headRotationAmplitude').min(0).max(PI).step(0.01).name('Rotation Amp');
  //head.open();
  
  
  var earRight = gui.addFolder('Ear Right');
  earRight.add(parameters, 'earRightCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  earRight.add(parameters, 'earRightRotationAmplitude').min(0).max(PI).step(0.01).name('Rotation Amp');
  //earRight.open();
  
  var earLeft = gui.addFolder('Ear Left');
  earLeft.add(parameters, 'earLeftCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  earLeft.add(parameters, 'earLeftRotationAmplitude').min(0).max(PI).step(0.01).name('Rotation Amp');
  //earLeft.open();
  
  var eyes = gui.addFolder('Eyes');
  eyes.add(parameters, 'eyeCycleOffset').min(-PI).max(PI).step(.1).name('Cycle Offset');
  eyes.add(parameters, 'eyeMinScale').min(0).max(1).step(0.01).name('Scale Min');
  eyes.add(parameters, 'eyeMaxScale').min(0).max(1).step(0.01).name('Scale Max');
  //earLeft.open();
  
  gui.remember(parameters);
}

function resetAnimation(){
  for(var i = 0; i<gui.__controllers.length;i++){
    gui.__controllers[i].setValue(0);
  }
}

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {
  container = document.getElementById('world');
  HEIGHT = container.offsetHeight;
  WIDTH = container.width;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();
  
  scene.fog = new THREE.Fog(0xd6eae6, 150,300);
  
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = 0;
  camera.position.z = 100;
  camera.position.y = 0;
  //camera.lookAt(new THREE.Vector3(0, 30, 0));

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.noZoom = true;
  
  clock = new THREE.Clock();
  handleWindowResize();
}

function handleWindowResize() {
  HEIGHT = container.offsetHeight;
  WIDTH = container.offsetWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLights() {
  globalLight = new THREE.AmbientLight(0xffffff, 1);
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(-8, 8, 8);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -40;
  shadowLight.shadow.camera.right = 40;
  shadowLight.shadow.camera.top = 40;
  shadowLight.shadow.camera.bottom = -40;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
  scene.add(globalLight);
  scene.add(shadowLight);
}

Hero = function() {
  this.status = "running";
  this.runningCycle = 0;
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  this.mesh.add(this.body);
  
  var torsoGeom = new THREE.CubeGeometry(7, 7, 10, 1);
  
  this.torso = new THREE.Mesh(torsoGeom, orangeMat);
  this.torso.position.z = 0;
  this.torso.position.y = 7;
  this.torso.rotation.x = -Math.PI/8;
  this.torso.castShadow = true;
  this.body.add(this.torso);
  
  var pantsGeom = new THREE.CubeGeometry(9, 9, 5, 1);
  this.pants = new THREE.Mesh(pantsGeom, whiteMat);
  this.pants.position.z = -3;
  this.pants.position.y = 0;
  this.pants.castShadow = true;
  this.torso.add(this.pants);
  
  var tailGeom = new THREE.CubeGeometry(3, 3, 3, 1);
  tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-2));
  this.tail = new THREE.Mesh(tailGeom, lightOrangeMat);
  this.tail.position.z = -4;
  this.tail.position.y = 5;
  this.tail.castShadow = true;
  this.torso.add(this.tail);
  
  var headGeom = new THREE.CubeGeometry(10, 10, 13, 1);
  headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,7.5));
  this.head = new THREE.Mesh(headGeom, orangeMat);
  this.head.position.z = 2;
  this.head.position.y = 11;
  this.head.castShadow = true;
  this.body.add(this.head);
  
  var cheekGeom = new THREE.CubeGeometry(1, 4, 4, 1);
  this.cheekR = new THREE.Mesh(cheekGeom, lightOrangeMat);
  this.cheekR.position.x = -5;
  this.cheekR.position.z = 7;
  this.cheekR.position.y = -2.5;
  this.cheekR.castShadow = true;
  this.head.add(this.cheekR);
  
  this.cheekL = this.cheekR.clone();
  this.cheekL.position.x = - this.cheekR.position.x;
  this.head.add(this.cheekL);
  
  var noseGeom = new THREE.CubeGeometry(6, 6, 3, 1);
  this.nose = new THREE.Mesh(noseGeom, lightOrangeMat);
  this.nose.position.z = 13.5;
  this.nose.position.y = 2.6;
  this.nose.castShadow = true;
  this.head.add(this.nose);
  
  var mouthGeom = new THREE.CubeGeometry(4, 2, 4, 1);
  mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,3));
  mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/12));
  this.mouth = new THREE.Mesh(mouthGeom, orangeMat);
  this.mouth.position.z = 8;
  this.mouth.position.y = -4;
  this.mouth.castShadow = true;
  this.head.add(this.mouth);
  
  var pawFGeom = new THREE.CubeGeometry(3,4,3, 1);
  this.pawFR = new THREE.Mesh(pawFGeom, lightOrangeMat);
  this.pawFR.position.x = -2.5;
  this.pawFR.position.z = 6;
  this.pawFR.position.y = 1.5;
  this.pawFR.castShadow = true;
  this.body.add(this.pawFR);
  
  this.pawFL = this.pawFR.clone();
  this.pawFL.position.x = - this.pawFR.position.x;
  this.pawFL.castShadow = true;
  this.body.add(this.pawFL);
  
  var pawBGeom = new THREE.CubeGeometry(3,3,6, 1);
  this.pawBL = new THREE.Mesh(pawBGeom, lightOrangeMat);
  this.pawBL.position.y = 1.5;
  this.pawBL.position.z = 0;
  this.pawBL.position.x = 5;
  this.pawBL.castShadow = true;
  this.body.add(this.pawBL);
  
  this.pawBR = this.pawBL.clone();
  this.pawBR.position.x = - this.pawBL.position.x;
  this.pawBR.castShadow = true;
  this.body.add(this.pawBR);
  
  var earGeom = new THREE.CubeGeometry(7, 18, 2, 1);
  earGeom.vertices[6].x+=2;
  earGeom.vertices[6].z+=.5;
  
  earGeom.vertices[7].x+=2;
  earGeom.vertices[7].z-=.5;
  
  earGeom.vertices[2].x-=2;
  earGeom.vertices[2].z-=.5;
  
  earGeom.vertices[3].x-=2;
  earGeom.vertices[3].z+=.5;
  earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,9,0));
  
  this.earL = new THREE.Mesh(earGeom, orangeMat);
  this.earL.position.x = 2;
  this.earL.position.z = 2.5;
  this.earL.position.y = 5;
  this.earL.rotation.z = -Math.PI/12;
  this.earL.castShadow = true;
  this.head.add(this.earL);
  
  this.earR = this.earL.clone();
  this.earR.position.x = -this.earL.position.x;
  this.earR.rotation.z = -this.earL.rotation.z;
  this.earR.castShadow = true;
  this.head.add(this.earR);
  
  var eyeGeom = new THREE.CubeGeometry(2,4,4);
  
  this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
  this.eyeL.position.x = 5;
  this.eyeL.position.z = 5.5;
  this.eyeL.position.y = 2.9;
  this.eyeL.castShadow = true;
  this.head.add(this.eyeL);
  
  var irisGeom = new THREE.CubeGeometry(.6,2,2);
  
  this.iris = new THREE.Mesh(irisGeom, blackMat);
  this.iris.position.x = 1.2;
  this.iris.position.y = 1;
  this.iris.position.z = 1;
  this.eyeL.add(this.iris);
  this.eyeR = this.eyeL.clone();
  this.eyeR.children[0].position.x = -this.iris.position.x;
  this.eyeR.position.x = -this.eyeL.position.x;
  this.head.add(this.eyeR);

  this.body.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

Hero.prototype.run = function(){
  var s = parameters.speed;
  this.runningCycle += delta * s;
  var t = this.runningCycle;
  
  var amp = 4;
  var disp = .2;
  
  var p = parameters;
  
  // BODY

  
  this.body.position.y = 6+ Math.sin(t + p.bodyCycleOffset) * p.bodyYAmplitude;
  this.body.rotation.x = .2 + Math.sin(t + p.bodyCycleOffset) * p.bodyRotationAmplitude;
  
  // TORSO
  this.torso.rotation.x =  Math.sin(t + p.torsoCycleOffset ) * p.torsoRotationAmplitude;
  this.torso.position.y =  7 + Math.sin(t + p.torsoCycleOffset )*p.torsoYAmplitude;
  
  // MOUTH
  this.mouth.rotation.x = Math.PI/16 + Math.cos(t) * p.mouthRotationAmplitude;
  
  // HEAD
  this.head.position.z = 2 + Math.sin(t + p.headCycleOffset) * p.headZAmplitude;
  this.head.position.y = 8 + Math.cos(t + p.headCycleOffset) * p.headYAmplitude;
  this.head.rotation.x = -.2 + Math.sin(t + p.headCycleOffset + PI*1.5) * p.headRotationAmplitude;
  
  // EARS
  this.earL.rotation.x = Math.cos(t + p.earLeftCycleOffset) * p.earLeftRotationAmplitude;
  this.earR.rotation.x = Math.cos(t + p.earRightCycleOffset)*p.earRightRotationAmplitude;
  
  /*
  eyeMinScale:.1,
  eyeMaxScale:1,
  */
  // EYES
  this.eyeR.scale.y = this.eyeL.scale.y = p.eyeMinScale +  Math.abs( Math.cos(t*.5 + p.eyeCycleOffset)) * (p.eyeMaxScale - p.eyeMinScale);
  
  // TAIL
  this.tail.rotation.x = Math.cos(t + p.tailCycleOffset) * p.tailRotationAmplitude;
  
  
  // FRONT RIGHT PAW
  this.pawFR.position.y = 1.5 + Math.sin(t + p.pawFRCycleOffset) * p.pawFRAmplitudeY;
  this.pawFR.position.z = 6 - Math.cos(t + p.pawFRCycleOffset) * p.pawFRAmplitudeZ;
  this.pawFR.rotation.x = Math.cos(t + p.pawFRCycleOffset ) * p.pawFRAnkleRotationAmplitude;
  
  // FRONT LEFT PAW
  
  this.pawFL.position.y = 1.5 + Math.sin(t + p.pawFLCycleOffset ) * p.pawFLAmplitudeY;
  this.pawFL.position.z = 6 - Math.cos(t + p.pawFLCycleOffset ) * p.pawFLAmplitudeZ;
  this.pawFL.rotation.x = Math.cos( t + p.pawFLCycleOffset ) * p.pawFLAnkleRotationAmplitude;
  
  
  // BACK RIGHT PAW
  this.pawBR.position.y = 1.5 + Math.sin( t + p.pawBRCycleOffset) * p.pawBRAmplitudeY;
  this.pawBR.position.z = - Math.cos( t + p.pawBRCycleOffset) * p.pawBRAmplitudeZ;
  this.pawBR.rotation.x = Math.cos(t + p.pawBRCycleOffset + PI *.25) * p.pawBRAnkleRotationAmplitude;
  
  // BACK LEFT PAW
  this.pawBL.position.y = 1.5 + Math.sin(t + p.pawBLCycleOffset)*p.pawBLAmplitudeY;
  this.pawBL.position.z = - Math.cos(t + p.pawBLCycleOffset)*p.pawBLAmplitudeZ; 
  this.pawBL.rotation.x = Math.cos(t + p.pawBLCycleOffset + PI *.25 ) * p.pawBLAnkleRotationAmplitude; 
}

function createHero() {
  hero = new Hero();
  hero.mesh.position.y=-15;
  hero.mesh.rotation.y = Math.PI/2;
  scene.add(hero.mesh);
}

function loop(){
  delta = clock.getDelta();
  hero.run();
  render();  
  requestAnimationFrame(loop);
}

function render(){
  renderer.render(scene, camera);
}



window.addEventListener('load', init, false);

function init(event){
  console.log("xhyutest");
  initScreenAnd3D();
  createLights();
  createHero();
  initGUI();
  loop();
  
}