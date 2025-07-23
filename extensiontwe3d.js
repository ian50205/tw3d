// tw3d-extension with functional blocks
(async function(Scratch) {
  const THREE = await Scratch.vm.runtime.fetchExtensionAsset('https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js')
    .then(res => res.text())
    .then(code => {
      const blob = new Blob([code], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      return import(url);
    });

  const sceneData = {
    scene: null,
    camera: null,
    renderer: null,
    objects: {},
    canvas: null,
    container: null
  };

  class TW3DExtension {
    constructor() {
      this.visible = true;
    }

    getInfo() {
      return {
        id: 'tw3dextension',
        name: '3D Scene',
        color1: '#a070ff',
        color2: '#8040ff',
        color3: '#6030c0',
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
            text: 'Set the scene camera to a perspective camera'
          },
          {
            opcode: 'setOrthographicCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set the scene camera to an orthographic camera'
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
            opcode: 'setCameraPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set camera position to x: [X] y: [Y] z: [Z]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
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
      if (sceneData.scene) return;
      sceneData.scene = new THREE.Scene();
      sceneData.renderer = new THREE.WebGLRenderer({ alpha: true });
      sceneData.renderer.setSize(480, 360);
      sceneData.canvas = sceneData.renderer.domElement;
      sceneData.container = document.createElement('div');
      sceneData.container.style.position = 'absolute';
      sceneData.container.style.top = '0';
      sceneData.container.style.left = '0';
      sceneData.container.appendChild(sceneData.canvas);
      document.body.appendChild(sceneData.container);
      this.setPerspectiveCamera();
      this._animate();
    }

    removeScene() {
      if (!sceneData.scene) return;
      sceneData.scene = null;
      sceneData.camera = null;
      sceneData.objects = {};
      if (sceneData.container) {
        document.body.removeChild(sceneData.container);
      }
      sceneData.container = null;
    }

    setPerspectiveCamera() {
      sceneData.camera = new THREE.PerspectiveCamera(75, 4 / 3, 0.1, 1000);
      sceneData.camera.position.z = 5;
    }

    setOrthographicCamera() {
      sceneData.camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 1000);
      sceneData.camera.position.z = 5;
    }

    createCube(args) {
      if (!sceneData.scene) return;
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(args.X, args.Y, args.Z);
      sceneData.objects[args.NAME] = cube;
      sceneData.scene.add(cube);
    }

    setCameraPosition(args) {
      if (sceneData.camera) {
        sceneData.camera.position.set(args.X, args.Y, args.Z);
      }
    }

    showScene() {
      if (sceneData.container) {
        sceneData.container.style.display = 'block';
      }
    }

    hideScene() {
      if (sceneData.container) {
        sceneData.container.style.display = 'none';
      }
    }

    _animate() {
      if (!sceneData.scene || !sceneData.camera || !sceneData.renderer) return;
      requestAnimationFrame(this._animate.bind(this));
      sceneData.renderer.render(sceneData.scene, sceneData.camera);
    }
  }

  Scratch.extensions.register(new TW3DExtension());
})(Scratch);
