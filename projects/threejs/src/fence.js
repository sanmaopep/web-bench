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