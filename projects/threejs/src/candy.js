import * as THREE from 'three';

function collectDisableCandyPosition() {
  const map = {};
  const size = 8 / 2 - 1;
  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      map[`${x}:${z}`] = true;
    }
  }
  scene.getObjectByName('snake').children.forEach(child => {
    delete map[`${child.position.x}:${child.position.z}`]
  })

  scene.getObjectByName('portals').children.forEach(portal => {
    delete map[`${portal.position.x}:${portal.position.z}`]
  })

  return Object.keys(map).map(key => key.split(':').map(Number));
}

function createCandy() {
  const candyGeometry = new THREE.SphereGeometry(0.3);
  const candyMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(219 / 255, 63 / 255, 97 / 255) });
  const candy = new THREE.Mesh(candyGeometry, candyMaterial);
  candy.name = 'candy';
  return candy;

}

export function genCandy() {
  const emptyCooList = collectDisableCandyPosition();
  const newPosition = emptyCooList.sort((a, b) => {
    if (a[1] === b[1]) {
      return a[0] - b[0];
    }
    return a[1] - b[1];
  })[0];
  const candy = createCandy();
  candy.position.set(newPosition[0], 1, newPosition[1]);
  return candy;
}

function getCandy() {
  return scene.getObjectByName('candy');
}

export function checkEatCandy(x, z) {
  const candy = getCandy();
  return candy.position.x === x && candy.position.z === z;
}

export function resetNewPosition() {
  const candy = getCandy();
  const emptyCooList = collectDisableCandyPosition();
  const newPosition = emptyCooList.sort((a, b) => {
    if (a[1] === b[1]) {
      return a[0] - b[0]
    }
    return a[1] - b[1];
  })[0];

  candy.position.set(newPosition[0], 1, newPosition[1]);
}