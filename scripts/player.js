/**
 * Player. Handles the audio flow, from note trigger/release , frequency resolution, wavetable, filter, envelope. Outputs audio.
 * @returns 
 */
const player = (function() {
    
    // Singleton instance
    var instance;

    function init() {
        // Private attributes
        const WAVE_ARRAY_LEN = 50;
        const START_OCTAVE = 4;
        const A_4_PITCH = 440;

        var audioContext = new (window.AudioContext || window.webkitAudioContext);
        var wave = new PeriodicWave(audioContext);

        var scaleTable = initScaleTable();

        function initScaleTable() {
            result = []

            result["a"] = 1;
            result["a#"] = 1.0594630943592953;
            result["b"] = 1.122462048309373;
            result["c"] = 1.189207115002721;
            result["c#"] = 1.2599210498948732;
            result["d"] = 1.3348398541700344;
            result["d#"] = 1.4142135623730951;
            result["e"] = 1.4983070768766815;
            result["f"] = 1.5874010519681994;
            result["f#"] = 1.681792830507429;
            result["g"] = 1.7817974362806785;
            result["g#"] = 1.8877486253633868;

            return result;
        }
        function noteToFrequency(note, octave) {
            var octaveDiff = octave - START_OCTAVE;
            var octaveAPitch = A_4_PITCH * Math.pow(2, octaveDiff);
            return octaveAPitch * scaleTable[note];
        }

        return {
            // Public attributes
            startNote: function(note) {

            },
            stopNote: function(note) {

            },
            setTone: function(waveArray) {
                // TODO: Normalize?
                var real = waveArray;
                var imag = new Array(WAVE_ARRAY_LEN).fill(0)
                fft.forward(real, imag);

                real = Float32Array(real)
                imag = Float32Array(imag)
                wave = audioContext.createPeriodicWave(real, imag)
            }
        }
    }

    return {
      getInstance: function() {
          if (!instance) {
              instance = init();
          }

          return instance;
      }
  }
})();


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Create an empty three-second stereo buffer at the sample rate of the AudioContext
const myArrayBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate * 3,
    audioCtx.sampleRate,
);

// Fill the buffer with white noise;
// just random values between -1.0 and 1.0
for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    // This gives us the actual ArrayBuffer that contains the data
    const nowBuffering = myArrayBuffer.getChannelData(channel);
    for (let i = 0; i < myArrayBuffer.length; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        nowBuffering[i] = Math.random() * 2 - 1;
    }
}

// Get an AudioBufferSourceNode.
// This is the AudioNode to use when we want to play an AudioBuffer
const source = audioCtx.createBufferSource();
// set the buffer in the AudioBufferSourceNode
source.buffer = myArrayBuffer;
// connect the AudioBufferSourceNode to the
// destination so we can hear the sound
source.connect(audioCtx.destination);
// start the source playing