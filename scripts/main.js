// import * as THREE from 'three';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
// camera.position.z = 5;

// function animate() {
//     requestAnimationFrame(animate);
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }

// animate();
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");


var userwaves = [{wave: Utilities.sineWave(100), pos: 0.0}, {wave: Utilities.squareWave(100), pos: 0.5}];
var wavetable = Wavetable.getInstance();
wavetable.addUserWave(userwaves[0]);
wavetable.addUserWave(userwaves[1]);
wavetable.getBuffer(1, 440);

const player = Player.getInstance();

startButton.onclick = () => {
    console.log("start");
    player.wavetable.addUserWave({wave: Utilities.sineWave(100), pos: 0.0});
    player.wavetable.addUserWave({wave: Utilities.squareWave(100), pos: 0.5});
    player.startNote("a", 4);
};

stopButton.onclick = () => {
    console.log("stop");
    player.stopNote("a", 4);
};