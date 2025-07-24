
(function(Scratch) {
  const THREE = window.THREE;
  if (!THREE) {
    Scratch.vm.runtime.emit('PROJECT_ERROR', 'Three.js is not loaded.');
    return;
  }

  let scene, camera, renderer;
  let container = null;
  const objects = {};

  class Tw3dExtension {
    getInfo() {
      return {
        id: 'tw3d',
        name: '3D Extension',
        color1: '#8e44ad',
        color2: '#71368a',
        blocks: [
          { opcode: 'createScene', blockType: Scratch.BlockType.COMMAND, text: 'Create a 3D scene' },
          { opcode: 'removeScene', blockType: Scratch.BlockType.COMMAND, text: 'Remove a 3D scene' },
          { opcode: 'createCube', blockType: Scratch.BlockType.COMMAND, text: 'Create a cube named [NAME] at (x:[X] y:[Y] z:[Z])',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Cube" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            } 
          },
          { opcode: 'setPerspectiveCamera', blockType: Scratch.BlockType.COMMAND, text: 'Set the scene camera to a perspective camera' },
          { opcode: 'setOrthographicCamera', blockType: Scratch.BlockType.COMMAND, text: 'Set the scene camera to an orthographic camera' },
          { opcode: 'setCameraPosition', blockType: Scratch.BlockType.COMMAND, text: 'Set camera position to x:[X] y:[Y] z:[Z]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          { opcode: 'showScene', blockType: Scratch.BlockType.COMMAND, text: 'Show the 3D scene' },
          { opcode: 'hideScene', blockType: Scratch.BlockType.COMMAND, text: 'Hide the 3D scene' },
        ]
      };
    }

    createScene() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(480, 360);
      container = document.createElement('div');
      container.id = 'threejs-container';
      container.style.position = 'absolute';
      container.style.top = '0px';
      container.style.left = '0px';
      container.style.zIndex = 1000;
      container.appendChild(renderer.domElement);
      document.body.appendChild(container);

      const animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    }

    removeScene() {
      if (container) {
        document.body.removeChild(container);
        container = null;
      }
      scene = null;
      camera = null;
      renderer = null;
    }

    createCube(args) {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(args.X, args.Y, args.Z);
      scene.add(cube);
      objects[args.NAME] = cube;
    }

    setPerspectiveCamera() {
      if (!renderer) return;
      camera = new THREE.PerspectiveCamera(75, 480 / 360, 0.1, 1000);
      camera.position.z = 5;
    }

    setOrthographicCamera() {
      if (!renderer) return;
      camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
      camera.position.z = 5;
    }

    setCameraPosition(args) {
      if (!camera) return;
      camera.position.set(args.X, args.Y, args.Z);
    }

    showScene() {
      if (container) container.style.display = 'block';
    }

    hideScene() {
      if (container) container.style.display = 'none';
    }
  }

  Scratch.extensions.register(new Tw3dExtension());
})(Scratch);
