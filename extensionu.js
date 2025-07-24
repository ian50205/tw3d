
(async function(Scratch) {
  const THREE = await (await fetch('https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js')).text();
  const blob = new Blob([THREE], {type: 'application/javascript'});
  const url = URL.createObjectURL(blob);
  const module = await import(url);

  const scene = new module.Scene();
  const camera = new module.PerspectiveCamera(75, 4/3, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new module.WebGLRenderer();
  renderer.setSize(480, 360);
  document.body.appendChild(renderer.domElement);

  const objects = {};

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  class TW3DExtension {
    getInfo() {
      return {
        id: 'tw3d',
        name: '3D Scene',
        color1: '#9C27B0',
        color2: '#7B1FA2',
        blocks: [
          { opcode: 'createScene', blockType: Scratch.BlockType.COMMAND, text: 'Create a 3D scene' },
          { opcode: 'removeScene', blockType: Scratch.BlockType.COMMAND, text: 'Remove a 3D scene' },
          { opcode: 'createCube', blockType: Scratch.BlockType.COMMAND, text: 'Create a cube named [NAME] at x: [X] y: [Y] z: [Z]', arguments: {
            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Cube" },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
          }},
          { opcode: 'setCameraPosition', blockType: Scratch.BlockType.COMMAND, text: 'Set camera position to x: [X] y: [Y] z: [Z]', arguments: {
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
          }},
          { opcode: 'showScene', blockType: Scratch.BlockType.COMMAND, text: 'Show the 3D scene' },
          { opcode: 'hideScene', blockType: Scratch.BlockType.COMMAND, text: 'Hide the 3D scene' }
        ]
      };
    }

    createScene() {
      renderer.domElement.style.display = 'block';
    }

    removeScene() {
      renderer.domElement.remove();
    }

    createCube(args) {
      const geometry = new module.BoxGeometry();
      const material = new module.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new module.Mesh(geometry, material);
      cube.position.set(args.X, args.Y, args.Z);
      scene.add(cube);
      objects[args.NAME] = cube;
    }

    setCameraPosition(args) {
      camera.position.set(args.X, args.Y, args.Z);
    }

    showScene() {
      renderer.domElement.style.display = 'block';
    }

    hideScene() {
      renderer.domElement.style.display = 'none';
    }
  }

  Scratch.extensions.register(new TW3DExtension());
})(Scratch);
