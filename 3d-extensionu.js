// TurboWarp 3D Extension - Core Implementation
// Features: Create scene, Remove scene, Set perspective/orthographic camera, Create cube, etc.

(function(Scratch) {
  const vm = Scratch.vm;

  let scene, camera, renderer, cube;
  let visible = true;

  function initThreeJS() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1000';
    document.body.appendChild(canvas);

    renderer = new THREE.WebGLRenderer({canvas, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    scene.add(cube);

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  }

  class ThreeDExtension {
    getInfo() {
      return {
        id: 'threedextension',
        name: '3D Extension',
        color1: '#8e44ad',
        color2: '#9b59b6',
        blocks: [
          {
            opcode: 'createScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create a 3D scene',
          },
          {
            opcode: 'removeScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Remove a 3D scene',
          },
          {
            opcode: 'setCameraPerspective',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set the scene camera to Perspective',
          },
          {
            opcode: 'setCameraOrtho',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set the scene camera to Orthographic',
          },
          {
            opcode: 'setCameraPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set camera position to x:[X] y:[Y] z:[Z]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
            },
          },
          {
            opcode: 'createCube',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create a cube named [NAME] at x:[X] y:[Y] z:[Z]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Cube' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            opcode: 'showScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Show 3D scene',
          },
          {
            opcode: 'hideScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Hide 3D scene',
          },
        ],
      };
    }

    createScene() {
      if (!scene) initThreeJS();
    }

    removeScene() {
      if (scene && renderer) {
        renderer.domElement.remove();
        scene = null;
        camera = null;
        renderer = null;
        cube = null;
      }
    }

    setCameraPerspective() {
      if (scene) {
        const aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        camera.position.z = 5;
      }
    }

    setCameraOrtho() {
      if (scene) {
        const aspect = window.innerWidth / window.innerHeight;
        const d = 5;
        camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
        camera.position.z = 5;
      }
    }

    setCameraPosition(args) {
      if (camera) {
        camera.position.set(args.X, args.Y, args.Z);
      }
    }

    createCube(args) {
      if (scene) {
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        mesh.name = args.NAME;
        mesh.position.set(args.X, args.Y, args.Z);
        scene.add(mesh);
      }
    }

    showScene() {
      visible = true;
    }

    hideScene() {
      visible = false;
    }
  }

  Scratch.extensions.register(new ThreeDExtension());
})(Scratch);