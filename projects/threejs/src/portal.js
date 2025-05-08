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