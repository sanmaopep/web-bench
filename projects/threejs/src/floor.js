import * as THREE from 'three';

export function createFloor() {
  const geometry = new THREE.PlaneGeometry(8, 8);
  const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(62 / 255, 117 / 255, 56 / 255) });
  const floor = new THREE.Mesh(geometry, material);
  floor.name = 'floor';
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  return floor;
}
