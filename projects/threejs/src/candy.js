// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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