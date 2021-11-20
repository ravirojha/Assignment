import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
let positions, x1, x2, x3, count;
const canvas = document.querySelector('canvas.webgl');
document.getElementById('create').addEventListener('click', createObject);
document.getElementById('delete').addEventListener('click', () => {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  points();
});

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
function createObject() {
  console.log(count);
  console.log(positions);

  const geometry = new THREE.BufferGeometry();
  const positionsArray = positions.slice();
  positionsArray[count * 3 + 0] = x1;
  positionsArray[count * 3 + 1] = x2;
  positionsArray[count * 3 + 2] = x3;
  console.log(positionsArray);
  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  geometry.setAttribute('position', positionsAttribute);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffa500
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);
/////////////////////////////////////////////////
function points() {
  let line;
  count = 0;
  let mouse = new THREE.Vector3();
  let geometry = new THREE.BufferGeometry();
  let MAX_POINTS = 500;
  positions = new Float32Array(MAX_POINTS * 3);
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

  // material
  let material = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    linewidth: 2
  });

  // line
  line = new THREE.Line(geometry, material);
  scene.add(line);

  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mousedown', onMouseDown, false);

  function updateLine() {
    positions[count * 3 - 3] = mouse.x;
    positions[count * 3 - 2] = mouse.y;
    positions[count * 3 - 1] = mouse.z;
    line.geometry.attributes.position.needsUpdate = true;
  }

  // mouse move handler
  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.z = 0;
    mouse.unproject(camera);
    if (count !== 0) {
      updateLine();
    }
  }

  // add point
  function addPoint(event) {
    console.log(
      'point nr ' + count + ': ' + mouse.x + ' ' + mouse.y + ' ' + mouse.z
    );
    if (count === 0) {
      x1 = mouse.x;
      x2 = mouse.y;
      x3 = mouse.z;
    }
    positions[count * 3 + 0] = mouse.x;
    positions[count * 3 + 1] = mouse.y;
    positions[count * 3 + 2] = mouse.z;
    count++;
    line.geometry.setDrawRange(0, count);
    updateLine();
  }

  // mouse down handler
  function onMouseDown(evt) {
    // on first click add an extra point
    if (count === 0) {
      addPoint();
    }
    addPoint();
  }
}
/////////////////////////////////////////
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

// createObject();
points();
tick();
