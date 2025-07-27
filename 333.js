
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must be run unsandboxed');
  }

  class TW3DExtension {
    getInfo() {
      return {
        id: 'tw3d',
        name: '3D Extension',
        color1: '#8000ff',
        blocks: [
          {
            opcode: 'createScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create a 3D scene'
          }
        ]
      };
    }

    createScene() {
      if (!window.THREE) {
        console.error('THREE is not defined. Make sure three.min.js is loaded.');
        return;
      }

      if (document.getElementById('tw3d-canvas')) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 4/3, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(480, 360);
      renderer.domElement.id = 'tw3d-canvas';
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.zIndex = '1000';
      renderer.domElement.style.pointerEvents = 'none';
      document.body.appendChild(renderer.domElement);

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      camera.position.z = 5;

      function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }

      animate();
    }
  }

  Scratch.extensions.register(new TW3DExtension());
})(Scratch);
