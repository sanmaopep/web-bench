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

export function genPortal() {
  const portalGroup = new THREE.Group();
  portalGroup.name = 'portals';

  function createPortalGate() {
    const geometry = new THREE.RingGeometry(0.3, 0.5, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const portal = new THREE.Mesh(geometry, material);
    portalGroup.add(portal);
    return portal;
  }

  const leftPortal = createPortalGate();
  leftPortal.position?.set(3, 1.1, -3);
  const rightPortal = createPortalGate();
  rightPortal.position?.set(-3, 1.1, 3);

  return portalGroup;
}

export function handlePortal(x, z) {
  const portals = scene.getObjectByName('portals').children;
  if (!portals.find((portal) => {
    return (portal.position.x === x && portal.position.z === z);
  })) {
    return false;
  }
  const destinationPosition = portals.find((portal) => {
    return !(portal.position.x === x && portal.position.z === z);
  })
  return destinationPosition.position;
}