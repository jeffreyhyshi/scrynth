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

var userwaves = [{wave: Utilities.squareWave(500), pos: 0.0}, {wave: Utilities.sawtoothWave(500), pos: 0.5}];

// Initialize to show wave 0
var pixels = [];
var curUserWave = 0;
for (var i = 0; i < userwaves[0].wave.length; i++) {
    // Draw single pixel boxes for each point in the user wave
    var rect = new fabric.Rect(
        {left:i, top: 500 - (userwaves[0].wave[i] + 1) * 250, fill: 'red', width:1, height:1}
    )
    rect.hasBorders = false;
    rect.hasControls = false;
    rect.lockMovementX = true;
    rect.lockMovementY = true;
    rect.selectable = false;

    pixels.push(rect);
    canvas.add(rect);
}

// Interactivity
var mousedown = false;
var prevX = null;
var prevY = null;
var updatePixels = function(event) {
    const x = Math.round(event.pointer.x);
    const y = Math.round(Math.min(event.pointer.y, 500));

    pixels[x].set('top', y);
    pixels[x].setCoords();

    if (prevX && prevY) {
        // Move pixels to fit the line between the previous and current mouse position
        let m = (y - prevY) / (x - prevX);
        let b = y - m * x;
        let xmin = Math.min(prevX, x);
        let xmax = Math.max(prevX, x);
        for (var i = xmin + 1; i < xmax; i++) {
            pixels[i].set('top', m * i + b);
            pixels[i].setCoords();
        }
    }

    canvas.renderAll();

    prevX = x;
    prevY = y;
}

canvas.on('mouse:down', function(event) {
    console.log('mousedown');
    mousedown = true;

    updatePixels(event);

})

canvas.on('mouse:move', function(event) {
    if (mousedown) {
        console.log('mousedown & mousemove');


        updatePixels(event);
    }
})

// Initialize the player
const player = Player.getInstance();
player.wavetable.addUserWave(userwaves[0]);
player.wavetable.addUserWave(userwaves[1]);

// Update wavetable upon mouseup
canvas.on('mouse:up', function(event) {
    mousedown = false;

    player.wavetable.removeUserWave(userwaves[curUserWave]);
    // Update wavetable to match pixel locations
    for (var i = 0; i < userwaves[curUserWave].wave.length; i++) {
        userwaves[curUserWave].wave[i] = (pixels[i].top - 500) / -250 - 1;
    }

    prevX = null;
    prevY = null;

    player.wavetable.addUserWave(userwaves[curUserWave])
})

const wave0Button = document.querySelector("#wave0");
const wave1Button = document.querySelector("#wave1");

var updateCanvasWithWave = function(userWaveIndex) {
    // Load in values from wavetable to pixels
    if (curUserWave != userWaveIndex) {
        curUserWave = userWaveIndex;

        for (var i = 0; i < userwaves[userWaveIndex].wave.length; i++) {
            pixels[i].set('top', 500 - (userwaves[userWaveIndex].wave[i] + 1) * 250);
            pixels[i].setCoords();
        }

        canvas.renderAll();
    }
}

wave0Button.onclick = () => {
    updateCanvasWithWave(0);
}

wave1Button.onclick = () => {
    updateCanvasWithWave(1);
}

const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");


startButton.onclick = () => {
    console.log("start");
    player.startNote("a", 4);
};

stopButton.onclick = () => {
    console.log("stop");
    player.stopNote("a", 4);
};

const cycles = document.querySelector("#cycles");
const phase = document.querySelector("#phase");

const sine = document.querySelector("#sine");
const square = document.querySelector("#square");
const sawtooth = document.querySelector("#sawtooth");

var updateToPresetWave = function(presetWave) {
    player.wavetable.removeUserWave(userwaves[curUserWave]);
    userwaves[curUserWave].wave = presetWave;
    player.wavetable.addUserWave(userwaves[curUserWave]);

    for (var i = 0; i < userwaves[curUserWave].wave.length; i++) {
        pixels[i].set('top', 500 - (userwaves[curUserWave].wave[i] + 1) * 250);
        pixels[i].setCoords();
    }

    canvas.renderAll();
}

sine.onclick = () => {
    var numCycles = 1;
    var phaseShift = 0;
    if (cycles.value) {
        numCycles = Number(cycles.value);
    }
    if (phase.value) {
        phaseShift = Number(phase.value) * Math.PI;
    }
    updateToPresetWave(Utilities.sineWave(500, numCycles, phaseShift));
    
}

square.onclick = () => {
    updateToPresetWave(Utilities.squareWave(500));
}

sawtooth.onclick = () => {
    updateToPresetWave(Utilities.sawtoothWave(500));
}