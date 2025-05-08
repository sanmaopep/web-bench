import * as THREE from 'three';

export function createLight() {
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(-10, 15, -10);
  return light;
}