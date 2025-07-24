
// ==TurboWarp Extension==
// @name tw3d-extension
// @version 1.0.0
// @description 3D engine with Three.js support
// @author ChatGPT
// @license MIT

(function(Scratch) {
  'use strict';

  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js';

  class TW3DExtension {
    constructor() {
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.objects = {};
      this.container = null;

      if (!window.THREE) {
        const script = document.createElement('script');
        script.src = THREE_URL;
        script.onload = () => {
          console.log('[tw3d] Three.js loaded');
        };
        document.head.appendChild(script);
      }
    }

    getInfo() {
      return {
        id: 'tw3dextension',
        name: '3D Scene',
        color1: '#a347ff',
        blocks: [
          {
            opcode: 'createScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create a 3D scene'
          },
          {
            opcode: 'removeScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Remove a 3D scene'
          },
          {
            opcode: 'createCube',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create a cube named [NAME] at x: [X] y: [Y] z: [Z]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Cube" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setPerspectiveCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set the scene camera to a perspective camera'
          },
          {
            opcode: 'setOrthographicCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set the scene camera to an orthographic camera'
          },
          {
            opcode: 'setCameraPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set camera position to x: [X] y: [Y] z: [Z]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'showScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Show the 3D scene'
          },
          {
            opcode: 'hideScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Hide the 3D scene'
          }
        ]
      };
    }

    createScene() {
      if (!window.THREE) {
        console.warn('THREE not loaded yet.');
        return;
      }
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setSize(480, 360);
      this.container = document.createElement('div');
      this.container.style.position = 'absolute';
      this.container.style.top = '0';
      this.container.style.left = '0';
      this.container.style.zIndex = 1000;
      this.container.appendChild(this.renderer.domElement);
      document.body.appendChild(this.container);
      this.animate();
    }

    removeScene() {
      if (this.container) {
        document.body.removeChild(this.container);
        this.container = null;
      }
      this.scene = null;
      this.camera = null;
      this.renderer = null;
    }

    createCube(args) {
      if (!this.scene || !window.THREE) return;
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(args.X, args.Y, args.Z);
      this.scene.add(cube);
      this.objects[args.NAME] = cube;
    }

    setPerspectiveCamera() {
      if (!window.THREE) return;
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 10;
    }

    setOrthographicCamera() {
      if (!window.THREE) return;
      this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 1000);
      this.camera.position.z = 10;
    }

    setCameraPosition(args) {
      if (this.camera) {
        this.camera.position.set(args.X, args.Y, args.Z);
      }
    }

    showScene() {
      if (this.container) this.container.style.display = 'block';
    }

    hideScene() {
      if (this.container) this.container.style.display = 'none';
    }

    animate() {
      if (!this.renderer || !this.scene || !this.camera) return;
      requestAnimationFrame(() => this.animate());
      this.renderer.render(this.scene, this.camera);
    }
  }

  Scratch.extensions.register(new TW3DExtension());
})(Scratch);
