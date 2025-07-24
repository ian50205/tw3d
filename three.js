(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must be run unsandboxed');
  }

  let scene, camera, renderer, container;
  const objects = {};

  class TW3DExtension {
    getInfo() {
      return {
        id: 'tw3d',
        name: '3D Scene',
        color1: '#8e44ad',
        color2: '#9b59b6',
        blocks: [
          { opcode: 'createScene', blockType: Scratch.BlockType.COMMAND, text: 'Create a 3D scene' },
          { opcode: 'removeScene', blockType: Scratch.BlockType.COMMAND, text: 'Remove a 3D scene' },
          { opcode: 'createCube', blockType: Scratch.BlockType.COMMAND, text: 'Create a cube named [NAME] at x: [X] y: [Y] z: [Z]', arguments: {
            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Cube' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
          }},
          { opcode: 'setPerspectiveCamera', blockType: Scratch.BlockType.COMMAND, text: 'Set the scene camera to perspective' },
          { opcode: 'setOrthographicCamera', blockType: Scratch.BlockType.COMMAND, text: 'Set the scene camera to orthographic' },
          { opcode: 'setCameraPosition', blockType: Scratch.BlockType.COMMAND, text: 'Set camera position to x: [X] y: [Y] z: [Z]', arguments: {
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
          }},
          { opcode: 'setCameraRotation', blockType: Scratch.BlockType.COMMAND, text: 'Set camera rotation to x: [X] y: [Y] z: [Z]', arguments: {
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
          }},
          { opcode: 'setCameraZoom', blockType: Scratch.BlockType.COMMAND, text: 'Set camera zoom to [ZOOM]', arguments: {
            ZOOM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
          }},
          { opcode: 'setCameraAspect', blockType: Scratch.BlockType.COMMAND, text: 'Set camera aspect ratio to [ASPECT]', arguments: {
            ASPECT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1.77 }
          }},
          { opcode: 'showScene', blockType: Scratch.BlockType.COMMAND, text: 'Show the 3D scene' },
          { opcode: 'hideScene', blockType: Scratch.BlockType.COMMAND, text: 'Hide the 3D scene' }
        ]
      };
    }

    createScene() {
      if (!container) {
        container = document.createElement('div');
        Object.assign(container.style, {
          position: 'absolute',
          top: '0', left: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '10'
        });
        document.body.appendChild(container);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();
      }
    }

    removeScene() {
      if (container) {
        container.remove();
        container = null;
        scene = null;
        camera = null;
        renderer = null;
      }
    }

    createCube(args) {
      if (!scene) return;
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(args.X, args.Y, args.Z);
      scene.add(cube);
      objects[args.NAME] = cube;
    }

    setPerspectiveCamera() {
      if (!renderer) return;
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;
    }

    setOrthographicCamera() {
      if (!renderer) return;
      const aspect = window.innerWidth / window.innerHeight;
      camera = new THREE.OrthographicCamera(-aspect * 5, aspect * 5, 5, -5, 0.1, 1000);
      camera.position.z = 5;
    }

    setCameraPosition(args) {
      if (camera) camera.position.set(args.X, args.Y, args.Z);
    }

    setCameraRotation(args) {
      if (camera) camera.rotation.set(args.X, args.Y, args.Z);
    }

    setCameraZoom(args) {
      if (camera && camera.zoom !== undefined) {
        camera.zoom = args.ZOOM;
        camera.updateProjectionMatrix();
      }
    }

    setCameraAspect(args) {
      if (camera && camera.isPerspectiveCamera) {
        camera.aspect = args.ASPECT;
        camera.updateProjectionMatrix();
      }
    }

    showScene() {
      if (container) container.style.display = 'block';
    }

    hideScene() {
      if (container) container.style.display = 'none';
    }
  }

  Scratch.extensions.register(new TW3DExtension());
})(Scratch);
