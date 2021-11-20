import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let positions, x1, x2, x3, count;
const canvas = document.querySelector('canvas.webgl');
document.getElementById('create').addEventListener('click', createObject);
document.getElementById('delete').addEventListener('click', () => {
  for (let i = 3; i > 1; i--) {
    scene.remove(scene.children[i]);
  }
  points();
});

// Scene
const scene = new THREE.Scene();
var grid = new THREE.GridHelper(1000, 100);
scene.add(grid);

/**
 * Object
 */
function createObject() {
  //   console.log(rgb);
  console.log(positions);

  const geometry = new THREE.BufferGeometry();
  const positionsArray = positions.slice();
  //   positionsArray[count * 3 + 0] = x1;
  //   positionsArray[count * 3 + 1] = x2;
  //   positionsArray[count * 3 + 2] = x3;
  console.log(positionsArray);
  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  geometry.setAttribute('position', positionsAttribute);

  geometry.setIndex([
    0, 1, 2, 0, 2, 3, 0, 4, 5, 0, 6, 7, 0, 8, 9, 0, 10, 11, 0, 12, 13, 0, 14,
    15, 0, 16, 17, 0, 18, 19, 0, 20, 21, 0, 22, 23, 0, 24, 25, 0, 26, 27, 0, 28,
    29, 0, 30, 31, 0, 32, 33, 0, 34, 35, 0, 36, 37, 0, 38, 39, 0, 40, 41
  ]);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffa500
    // wireframe: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  let lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2
  });
  let edges = new THREE.LineSegments(geometry, material);
  mesh.add(edges);
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
  500
);
camera.position.set(0, 3, 2); // Set position like this
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.position.y = 200;

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
    if (count !== 0) {
      positions[count * 3 + 0] = mouse.x;
      positions[count * 3 + 1] = mouse.y;
      positions[count * 3 + 2] = mouse.z;
    }
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
  canvas: canvas,
  alpha: true
});
renderer.setClearColor(0xffffff, 0);
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
