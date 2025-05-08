# Three.js

## [Evaluate](../readme.md)

## Introduction
Three.js is a highly significant **JavaScript** library in the front-end domain, making it easier and more efficient to create and display **3D** graphics on web pages. With Three.js, developers can harness the powerful capabilities of **WebGL** without needing to delve into its underlying complexities. It offers a rich set of tools and features, including **geometries, materials, lighting, shadows, and animations**, making the creation of realistic 3D scenes and interactive experiences more intuitive and convenient.

The importance of Three.js also lies in its wide application and community support. Whether it's **game development, data visualization, virtual reality (VR), or augmented reality (AR)**, Three.js provides robust support. Its open-source nature and active community allow developers to share resources and exchange experiences, thereby advancing the entire front-end 3D graphics field.

## Project Design

We will implement a 3D version of the Snake game by threejs. We have added a portal mechanism to this game.

Tipical Snake game features are:

1. Create 8 * 8 table.
2. Create a snake that can be controlled by the user to move.
3. Collision detection.
4. Auto create and place Candy.
5. Snake can grow by eating candy.
6. Portal mechanism.
7. Game over detection.
8. more...

### Tasks

1. Generate scene, Create a renderer and enable auto-refresh
2. Generate an 8 * 8 floor
3. Create a camera, Place a point light source
4. Generate a snake group and snakeHead
5. Generate snakeBody
6. Support movement control in forward, backward, left, and right directions
7. Generate a surrounding fence and add collision detection
8. Generate candy
9. Grow by one unit when the snake eats candy
10. Candy animation
11. Generate portal
12. Portal animation
13. Candy cannot be generated in the portal
14. Mouse view rotation
15. Click 'h' to center the view
16. View automatically follows the snake's head movement
17. Snake resets to initial state when entering a dead-end
18. Snake auto movement
19. The snake changes color after passing through the portal
20. Game success when the snake's length reaches 20


## Feature Coverage

| API                      | Status |
|----------------------    |--------|
| Scenes                   | ✅     |
| Cameras                  | ✅     |
| - Camera                 | ✅     |
| - CubeCamera             | ❌     |
| - OrthographicCamera     | ❌     |
| - PerspectiveCamera      | ✅     |
| - StereoCamera           | ❌     |
| Materials                | ✅     |
| Animation                | ✅     |
| - AnimationAction        | ✅     |
| - AnimationClip          | ✅     |
| - AnimationMixer         | ✅     |
| - AnimationObjectGroup   | ❌     |
| - AnimationUtils         | ❌     |
| Geometry                 | ✅     |
| - BoxGeometry            | ✅     |
| - CircleGeometry         | ❌     |
| - ConeGeometry           | ✅     |
| - CylinderGeometry       | ❌     |
| - PlaneGeometry          | ✅     |
| - PolyhedronGeometry     | ❌     |
| - RingGeometry           | ✅     |
| - ShapeGeometry          | ❌     |
| - SphereGeometry         | ✅     |
| Objects                  | ✅     |
| - BatchedMesh            | ❌     |
| - Bone                   | ❌     |
| - Group                  | ✅     |
| - Line                   | ❌     |
| - Mesh                   | ✅     |
| - Skeleton               | ❌     |
| - Sprite                 | ❌     |
| Textures                 | ❌     |
| Renderers                | ✅     |
| Light & Shadow           | ✅     |
| Loader                   | ❌     |
| Math                     | ✅     |
| Audio                    | ❌     |
| Helper                   | ❌     |


## Reference
- [Three.js docs](https://threejs.org/docs/index.html)
