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

let snakeBodyList = [];

function createBody() {
  const snakeBodyGeometry = new THREE.SphereGeometry(0.5);
  const snakebodyMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(66 / 255, 70 / 255, 75 / 255) });
  const snakeBody = new THREE.Mesh(snakeBodyGeometry, snakebodyMaterial);
  snakeBody.name = 'snake_body';
  return snakeBody;
}

export function createSnake() {
  const snake = new THREE.Group();
  snake.name = 'snake';
  snake.position.set(0, 0.5, 0);

  const snakeHeadGeometry = new THREE.ConeGeometry(0.5, 1, 32);
  const snakeHeadMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
  const snakeHead = new THREE.Mesh(snakeHeadGeometry, snakeHeadMaterial);
  snakeHead.name = 'snake_head';
  snakeHead.rotation.x = Math.PI / 2;
  snake.add(snakeHead);
  resetSnake(snake);

  return snake;
}

export function moveSnakeBody(destination) {
  for (let i = snakeBodyList.length - 1; i >= 0; i--) {
    const currentBody = snakeBodyList[i];
    if (i === 0) {
      currentBody.position.set(destination.x, destination.y, destination.z);
    } else {
      const preBody = snakeBodyList[i - 1];
      currentBody.position.set(preBody.position.x, preBody.position.y, preBody.position.z);
    }
  }
}

export function checkCollision(x, z) {
  for (let body of snakeBodyList.slice(0, snakeBodyList.length - 1)) {
    if (Math.abs(body.position.x - x) < 1 && Math.abs(body.position.z - z) < 1) {
      return true;
    }
  }
  return false;
}

export function getSnake() {
  return scene.getObjectByName('snake');
}
export function getSnakeHead() {
  return getSnake().getObjectByName('snake_head');
}

export function snakeHeadRotate(direction) {
  const snakeHead = getSnakeHead();
  snakeHead.userData.direction = direction;
  if (direction === 'n') {
    snakeHead.rotation.x = -Math.PI / 2;
    snakeHead.rotation.z = 0;
  } else if (direction === 's') {
    snakeHead.rotation.x = Math.PI / 2;
    snakeHead.rotation.z = 0;
  } else if (direction === 'w') {
    snakeHead.rotation.x = 0;
    snakeHead.rotation.z = Math.PI / 2;
  } else if (direction === 'e') {
    snakeHead.rotation.x = 0;
    snakeHead.rotation.z = -Math.PI / 2;
  }
}

export function growthSnakeBody(destination) {
  const snake = getSnake();
  const newSnakeBody = createBody();
  newSnakeBody.position.set(destination.x, destination.y, destination.z);
  snakeBodyList.unshift(newSnakeBody);
  snake.add(newSnakeBody);

  if (snakeBodyList.length >= 20) {
    scene.clear();
  }
}

export function resetSnake(snake) {
  const snakeHead = snake.getObjectByName('snake_head');
  snakeHead.userData.direction = 'n' //  n:-z  s:z  w:-x  e:x 
  snakeHead.position.set(0, 0.5, 0);
  snakeHead.rotation.x = -Math.PI / 2;
  snakeHead.rotation.z = 0;

  snakeBodyList.forEach(body => {
    snake.remove(body);
  })
  snakeBodyList = [];
  for (let i = 1; i < 4; i++) {
    const newSnakeBody = createBody();
    newSnakeBody.position.set(0, 0.5, i);
    snakeBodyList.push(newSnakeBody);
    snake.add(newSnakeBody);
  }
}