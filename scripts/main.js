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

import { fabric } from 'fabric';
var canvas = new fabric.Canvas('c');
var rect = new fabric.Rect({
    left:100, top:100, fill: 'red', width:20, height:20
})
rect.hasBorders = false;
rect.hasControls = false;
rect.lockMovementY = true;

canvas.add(rect);

rect.on('mouseover', function(options) {
    console.log('mouseover');
    rect.set('fill', 'green');
    canvas.renderAll();
});

rect.on('mouseout', function(options) {
    console.log('mouseover');
    rect.set('fill', 'red');
    canvas.renderAll();
});



const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");


// var userwaves = [{wave: Utilities.sineWave(100), pos: 0.0}, {wave: Utilities.squareWave(100), pos: 0.5}];
// var wavetable = Wavetable.getInstance();
// wavetable.addUserWave(userwaves[0]);
// wavetable.addUserWave(userwaves[1]);
// wavetable.getBuffer(1, 440);

const player = Player.getInstance();

startButton.onclick = () => {
    console.log("start");
    player.wavetable.addUserWave({wave: Utilities.squareWave(500), pos: 0.5})
    player.wavetable.addUserWave({wave: Utilities.sineWave(500), pos: 0.75});
    player.wavetable.addUserWave({wave: Utilities.sineWave(500), pos: 0.0});
    player.wavetable.addUserWave({wave: Utilities.sineWave(500), pos: 0.3});
    

    player.startNote("c", 3);
};

stopButton.onclick = () => {
    console.log("stop");
    player.stopNote("c", 3);
};