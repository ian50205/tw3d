
// ==UserScript==
// @name         TurboWarp 3D Extension (Basic)
// ==/UserScript==

const scene3D = (() => {
  let scene, camera, renderer, container;

  const createScene = () => {
    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '1000';
    document.body.appendChild(container);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    animate();
  };

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  const createCube = (name, x, y, z) => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = name;
    cube.position.set(x, y, z);
    scene.add(cube);
  };

  const removeScene = () => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    scene = null;
    camera = null;
    renderer = null;
  };

  return {
    createScene,
    createCube,
    removeScene
  };
})();


window.addEventListener('load', () => {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js';
  s.onload = () => {
    console.log('Three.js loaded');
    scene3D.createScene();
    scene3D.createCube('Cube', 0, 0, 0);
  };
  document.head.appendChild(s);
});
