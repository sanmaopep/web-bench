import * as THREE from 'three';

let animationCb = [];
const animationMixer = [];

function addCandyAnimation() {
  const candy = scene.getObjectByName('candy');
  animationCb.push((i) => {
    // i -> 0   --- 0.5 --- 1
    // y -> 0.5 --- 1.5 --- 0.5
    const y = 0.5 + (Math.abs((i - 0.5)) * 2);
    candy.position.y = y;
  })
}

function initPortalAnimation() {
  const portal = scene.getObjectByName('portals');
  portal.children.forEach((p) => {
    bindPortalColorAnimation(p)
    bindPortalRotationAnimation(p)
  });
}

function bindPortalRotationAnimation(target) {
  animationCb.push((i) => {
    target.rotation.y = -Math.PI + 2 * Math.PI * i;
  })
}

function bindPortalColorAnimation(target) {
  const colorTimes = [0, 0.5, 1, 1.5, 2];
  const colorVecs = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
    0, 1, 0,
    1, 0, 0
  ];

  const colorKeyFrameTrack = new THREE.NumberKeyframeTrack('.material.color', colorTimes, colorVecs);
  const animationClip = new THREE.AnimationClip('colorAnimation', 2, [colorKeyFrameTrack]);
  const mixer = new THREE.AnimationMixer(target);
  mixer.clipAction(animationClip).play();

  animationMixer.push(mixer);
}

export function startAnimation() {
  addCandyAnimation();
  initPortalAnimation();
  animation();
}

const clock = new THREE.Clock();

export function animation() {
  const date = +new Date();
  const index = date % 3000 / 3 / 1000;
  renderer.render(scene, camera);
  animationCb.forEach(cb => cb(index));
  const delta = clock.getDelta();
  animationMixer.forEach(mixer => mixer.update(delta));
  requestAnimationFrame(animation);
}

const DESTINATION_VECTOR = {
  'n': new THREE.Vector3(0, 15, 15),
  's': new THREE.Vector3(0, 15, -15),
  'w': new THREE.Vector3(15, 15, 0),
  'e': new THREE.Vector3(-15, 15, 0),
}

function startCameraRotate(direction) {
  const destination = DESTINATION_VECTOR[direction];

  camera.position.set(...destination.toArray());
  camera.lookAt(0, 0, 0);
}

export function rotateCameraToDirection(direction) {
  if (!window.lockViewer) {
    return
  }

  startCameraRotate(direction);
}
