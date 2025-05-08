import * as THREE from 'three';

export function genFence() {
  const fences = new THREE.Group();
  fences.name = 'fences';

  const fenceGeometry = new THREE.BoxGeometry(1, 1, 1);
  const fenceMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(30 / 255, 59 / 255, 28 / 255) });

  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      if (x === -4 || x === 4 || z === -4 || z === 4) {
        const fence = new THREE.Mesh(fenceGeometry, fenceMaterial);
        fence.position.set(x, 0.5, z);
        fences.add(fence);
      }
    }
  }

  return fences;
}