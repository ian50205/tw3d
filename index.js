
// 使用本地載入的 Three.js
const THREE = window.THREE;
let scene, camera, renderer, container;
let isSceneVisible = true;

function createRenderer() {
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(480, 360);
    container = document.createElement("div");
    container.id = "tw3d-container";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
}

function animate() {
    requestAnimationFrame(animate);
    if (scene && camera && renderer && isSceneVisible) {
        renderer.render(scene, camera);
    }
}

(function(Scratch) {
    "use strict";

    class Tw3DExtension {
        getInfo() {
            return {
                id: "tw3d",
                name: "3D Scene",
                color1: "#8e44ad",
                color2: "#732d91",
                blocks: [
                    { opcode: "createScene", blockType: Scratch.BlockType.COMMAND, text: "Create a 3D scene" },
                    { opcode: "removeScene", blockType: Scratch.BlockType.COMMAND, text: "Remove a 3D scene" },
                    { opcode: "showScene", blockType: Scratch.BlockType.COMMAND, text: "Show the 3D scene" },
                    { opcode: "hideScene", blockType: Scratch.BlockType.COMMAND, text: "Hide the 3D scene" },
                    { opcode: "setCameraPerspective", blockType: Scratch.BlockType.COMMAND, text: "Set scene camera to perspective with fov [FOV]", arguments: { FOV: { type: "number", defaultValue: 75 } } },
                    { opcode: "createCube", blockType: Scratch.BlockType.COMMAND, text: "Create a cube named [NAME] at x: [X] y: [Y] z: [Z]", arguments: { NAME: { type: "string", defaultValue: "Cube" }, X: { type: "number", defaultValue: 0 }, Y: { type: "number", defaultValue: 0 }, Z: { type: "number", defaultValue: 0 } } }
                ]
            };
        }

        createScene() {
            scene = new THREE.Scene();
            createRenderer();
            animate();
        }

        removeScene() {
            if (container) container.remove();
            scene = null;
            camera = null;
            renderer = null;
        }

        showScene() {
            if (container) container.style.display = "block";
            isSceneVisible = true;
        }

        hideScene() {
            if (container) container.style.display = "none";
            isSceneVisible = false;
        }

        setCameraPerspective(args) {
            const fov = args.FOV || 75;
            camera = new THREE.PerspectiveCamera(fov, 480 / 360, 0.1, 1000);
            camera.position.z = 5;
        }

        createCube(args) {
            if (!scene) return;
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.name = args.NAME || "Cube";
            cube.position.set(args.X, args.Y, args.Z);
            scene.add(cube);
        }
    }

    Scratch.extensions.register(new Tw3DExtension());
})(Scratch);
