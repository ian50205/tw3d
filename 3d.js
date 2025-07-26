
class ThreeDExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.objects = {};
    this.visible = true;
  }

  getInfo() {
    return {
      id: 'threed',
      name: '3D',
      color1: '#8a2be2',
      blocks: [
        { opcode: 'createScene', blockType: 'command', text: 'Create a 3D scene' },
        { opcode: 'removeScene', blockType: 'command', text: 'Remove a 3D scene' },
        { opcode: 'setCameraType', blockType: 'command', text: 'Set the scene camera to [TYPE]', arguments: { TYPE: { type: 'string', menu: 'cameraTypes', defaultValue: 'Perspective' } } },
        { opcode: 'setCameraPosition', blockType: 'command', text: 'Set camera position to x:[X] y:[Y] z:[Z]', arguments: { X: { type: 'number', defaultValue: 0 }, Y: { type: 'number', defaultValue: 5 }, Z: { type: 'number', defaultValue: 10 } } },
        { opcode: 'setCameraRotation', blockType: 'command', text: 'Set camera rotation to x:[X] y:[Y] z:[Z]', arguments: { X: { type: 'number', defaultValue: 0 }, Y: { type: 'number', defaultValue: 0 }, Z: { type: 'number', defaultValue: 0 } } },
        { opcode: 'setCameraZoom', blockType: 'command', text: 'Set camera zoom to [ZOOM]', arguments: { ZOOM: { type: 'number', defaultValue: 1 } } },
        { opcode: 'setCameraAspect', blockType: 'command', text: 'Set camera aspect ratio to [ASPECT]', arguments: { ASPECT: { type: 'number', defaultValue: 1.5 } } },
        { opcode: 'createCube', blockType: 'command', text: 'Create a cube named [NAME] at x:[X] y:[Y] z:[Z]', arguments: { NAME: { type: 'string', defaultValue: 'Cube' }, X: { type: 'number', defaultValue: 0 }, Y: { type: 'number', defaultValue: 0 }, Z: { type: 'number', defaultValue: 0 } } },
        { opcode: 'showScene', blockType: 'command', text: 'Show 3D scene' },
        { opcode: 'hideScene', blockType: 'command', text: 'Hide 3D scene' }
      ],
      menus: {
        cameraTypes: {
          acceptReporters: true,
          items: ['Perspective', 'Orthographic']
        }
      }
    };
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1.5, 0.1, 1000);
    this.camera.position.z = 10;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '480px';
    this.canvas.style.height = '360px';
    this.canvas.style.zIndex = '1000';
    document.body.appendChild(this.canvas);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setSize(480, 360);
    this._animate();
  }

  _animate() {
    if (!this.scene || !this.camera || !this.renderer) return;
    requestAnimationFrame(this._animate.bind(this));
    if (this.visible) this.renderer.render(this.scene, this.camera);
  }

  removeScene() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.objects = {};
  }

  setCameraType(args) {
    if (args.TYPE === 'Perspective') {
      this.camera = new THREE.PerspectiveCamera(75, 1.5, 0.1, 1000);
    } else {
      this.camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    }
    this.camera.position.z = 10;
  }

  setCameraPosition(args) {
    if (this.camera) this.camera.position.set(args.X, args.Y, args.Z);
  }

  setCameraRotation(args) {
    if (this.camera) this.camera.rotation.set(args.X, args.Y, args.Z);
  }

  setCameraZoom(args) {
    if (this.camera) {
      this.camera.zoom = args.ZOOM;
      this.camera.updateProjectionMatrix();
    }
  }

  setCameraAspect(args) {
    if (this.camera) {
      this.camera.aspect = args.ASPECT;
      this.camera.updateProjectionMatrix();
    }
  }

  createCube(args) {
    if (!this.scene) return;
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(args.X, args.Y, args.Z);
    this.scene.add(cube);
    this.objects[args.NAME] = cube;
  }

  showScene() {
    if (this.canvas) this.canvas.style.display = 'block';
    this.visible = true;
  }

  hideScene() {
    if (this.canvas) this.canvas.style.display = 'none';
    this.visible = false;
  }
}
Scratch.extensions.register(new ThreeDExtension());
