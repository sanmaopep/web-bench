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

export function cameraController() {
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  const dom = renderer.domElement;

  dom.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });

  dom.addEventListener('mouseup', () => {
    isDragging = false;
  });

  dom.addEventListener('mousemove', (event) => {
    if (isDragging && event.buttons === 1) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      const rotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(deltaMove.y * 0.1),
          THREE.MathUtils.degToRad(deltaMove.x * 0.1),
          0,
          'XYZ'
        )
      );
      camera.quaternion.multiplyQuaternions(rotationQuaternion, camera.quaternion);

      previousMousePosition = { x: event.clientX, y: event.clientY };
    } else if (isDragging && event.buttons === 2) {
      const movementSpeed = 0.1;
      const deltaX = event.movementX * movementSpeed;
      const deltaZ = event.movementY * movementSpeed;

      const cameraRotationVector = new THREE.Vector3().copy(camera.rotation).projectOnPlane(new THREE.Vector3(0, 1, 0));

      const forward = new THREE.Vector3().copy(cameraRotationVector).cross(new THREE.Vector3(0, 1, 0));
      const right = new THREE.Vector3();
      right.crossVectors(forward, camera.up);

      const up = new THREE.Vector3();
      up.crossVectors(new THREE.Vector3(0, -1, 0), right);

      camera.position.addScaledVector(right, -deltaX);
      camera.position.addScaledVector(up, -deltaZ);
    }
  });

  dom.addEventListener('wheel', (event) => {
    const zoomSpeed = 0.1;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const distance = event.deltaY * zoomSpeed;
    camera.position.addScaledVector(direction, distance);
  });

  dom.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
      camera.position.set(0, 15, 15);
      camera.lookAt(0, 0, 0);
    }
    if (event.key === 'l') {
      window.lockViewer = !window.lockViewer;
    }
    if (event.key === 'a') {
      window.autoMove = !window.autoMove;
    }
  });
}