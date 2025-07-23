
// TurboWarp 3D Extension (Simplified)
(function(Scratch) {
  const vm = Scratch.vm;

  let scene = null;
  let camera = null;
  let renderer = null;
  let canvas = null;
  let objects = {};

  function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 4/3, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(480, 360);
    canvas = renderer.domElement;
    document.body.appendChild(canvas);
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  class TW3DExtension {
    getInfo() {
      return {
        id: 'tw3d',
        name: '3D',
        color1: '#8000ff',
        color2: '#6600cc',
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
            opcode: 'setPerspectiveCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set the scene camera to perspective'
          },
          {
            opcode: 'setOrthographicCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set the scene camera to orthographic'
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
      if (!scene) {
        initScene();
        console.log("3D scene created.");
      }
    }

    removeScene() {
      if (canvas && canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
        scene = null;
        camera = null;
        renderer = null;
        canvas = null;
        objects = {};
        console.log("3D scene removed.");
      }
    }

    setPerspectiveCamera() {
      if (scene) {
        camera = new THREE.PerspectiveCamera(75, 4/3, 0.1, 1000);
        camera.position.z = 5;
      }
    }

    setOrthographicCamera() {
      if (scene) {
        camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
        camera.position.z = 5;
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
      console.log(`Created cube "${args.NAME}" at (${args.X}, ${args.Y}, ${args.Z})`);
    }

    showScene() {
      if (canvas) canvas.style.display = 'block';
    }

    hideScene() {
      if (canvas) canvas.style.display = 'none';
    }
  }

  Scratch.extensions.register(new TW3DExtension());
})(Scratch);
