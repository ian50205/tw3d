(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must be run unsandboxed');
  }

  let scene, camera, renderer;
  let objects = {};

  class ThreeDExtension {
    getInfo() {
      return {
        id: 'threedscene',
        name: '3D Scene',
        color1: '#9C27B0',
        color2: '#7B1FA2',
        blocks: [
          {
            opcode: 'createScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create a 3D scene'
          },
          {
            opcode: 'createCube',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create a cube named [NAME] at ([X], [Y], [Z])',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Cube' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          }
        ]
      };
    }

    createScene() {
      if (scene) return;

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      const animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    }

    createCube(args) {
      if (!scene) return;

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(args.X, args.Y, args.Z);
      scene.add(cube);
      objects[args.NAME] = cube;

      console.log(`Created cube "${args.NAME}" at (${args.X}, ${args.Y}, ${args.Z})`);
    }
  }

  if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js';
    script.onload = () => Scratch.extensions.register(new ThreeDExtension());
    document.head.appendChild(script);
  } else {
    Scratch.extensions.register(new ThreeDExtension());
  }
})(Scratch);
