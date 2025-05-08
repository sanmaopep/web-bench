import * as THREE from 'three';

import { createFloor } from './floor.js';
import { createLight } from './light.js';
import { growthSnakeBody, resetSnake, createSnake, snakeHeadRotate, checkCollision as checkSnakeCollision, getSnakeHead, moveSnakeBody } from './snake.js';
import { genFence } from './fence.js'
import { startAnimation, rotateCameraToDirection } from './animation.js'
import { genCandy, checkEatCandy, resetNewPosition } from './candy.js'
import { genPortal, handlePortal } from './portal.js'
import { cameraController } from './control.js'

window.scene = new THREE.Scene();
window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 15, 15);
camera.lookAt(0, 0, 0);

window.renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('root').appendChild(renderer.domElement);

const floor = createFloor();
scene.add(floor);

const light = createLight();
scene.add(light);

const snake = createSnake();
scene.add(snake);

const snakeHead = getSnakeHead();

const fences = genFence();
scene.add(fences)

const portal = genPortal();
scene.add(portal);

const candy = genCandy();
scene.add(candy);

function checkCollision(x, z) {
  for (let fence of fences.children) {
    if (Math.abs(fence.position.x - x) < 1 && Math.abs(fence.position.z - z) < 1) {
      return true;
    }
  }
  const snakeBodyCollision = checkSnakeCollision(x, z);
  return snakeBodyCollision;
}

function collectDisableMovePosition() {
  const map = {};
  const size = 8 / 2 - 1;
  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      map[`${x}:${z}`] = true;
    }
  }
  snake.children.forEach(child => {
    delete map[`${child.position.x}:${child.position.z}`]
  })
  return map;
}

function checkGameOver() {
  const { x, z } = snakeHead.position;
  const emptyCooList = collectDisableMovePosition();
  const livePosition = [
    [x, z + 1],
    [x, z - 1],
    [x + 1, z],
    [x - 1, z],
  ]
  if (!livePosition.some(pos => {
    return emptyCooList[`${pos[0]}:${pos[1]}`]
  })) {
    resetSnake(snake);
    resetNewPosition();
  }
}

function move(direction) {
  let newX = snakeHead.position.x;
  let newZ = snakeHead.position.z;

  switch (direction) {
    case 'n':
      newZ -= 1;
      break;
    case 's':
      newZ += 1;
      break;
    case 'w':
      newX -= 1;
      break;
    case 'e':
      newX += 1;
      break;
  }
  if (!direction) {
    return;
  }

  const newPos = handlePortal(newX, newZ);
  if (newPos) {
    newX = newPos.x;
    newZ = newPos.z;

    const portalColor = portal.children[0].material.color;
    snake.children.forEach(child => {
      child.material.color.copy(portalColor);
    })
  }

  const ateCandy = checkEatCandy(newX, newZ);

  if (!checkCollision(newX, newZ)) {
    if (ateCandy) {
      growthSnakeBody(snakeHead.position);
    } else {
      moveSnakeBody(snakeHead.position);
    }
    snakeHead.position.x = newX;
    snakeHead.position.z = newZ;
    snakeHeadRotate(direction);
    rotateCameraToDirection(direction);

    if (ateCandy) {
      resetNewPosition();
    }
  }

  checkGameOver();
}

function autoMove() {
  if (window.autoMove) {
    move(snakeHead.userData.direction || 'n');
  }
  setTimeout(() => {
    autoMove();
  }, 1000);
}
autoMove();

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      move('n');
      break;
    case 'ArrowDown':
      move('s');
      break;
    case 'ArrowLeft':
      move('w');
      break;
    case 'ArrowRight':
      move('e');
      break;
  }
});

cameraController();

startAnimation();
