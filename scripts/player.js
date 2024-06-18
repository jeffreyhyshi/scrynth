/**
 * Player. Handles the audio flow, from note trigger/release, frequency resolution, wavetable, filter, envelope. Outputs audio. 
 */
const Player = (function() {
    // Singleton instance
    var instance;

    const SAMPLE_RATE = 44100;
    const WAVE_ARRAY_LEN = 200;
    const START_OCTAVE = 4;
    const A_4_PITCH = 440;
    const SCALE_TABLE = new Map([
        ["a", 1],
        ["a#", 1.0594630943592953],
        ["b", 1.122462048309373],
        ["c", 1.189207115002721],
        ["c#", 1.2599210498948732],
        ["d", 1.3348398541700344],
        ["d#", 1.4142135623730951],
        ["e", 1.4983070768766815],
        ["f", 1.5874010519681994],
        ["f#", 1.681792830507429],
        ["g", 1.7817974362806785],
        ["g#", 1.8877486253633868]
    ]);

    function init() {
        // Private attributes
        var audioContext = new (window.AudioContext || window.webkitAudioContext);
        var wavetable = Wavetable.getInstance();
        var lfo = Lfo.get(1, -1, 1);
        // {note, octave} => AudioBufferSourceNode
        var activeNotes = new Map();
        var filtertable = Filtertable.getInstance(audioContext);

        function noteToFrequency(note, octave) {
            var octaveDiff = octave - START_OCTAVE;
            var octaveAPitch = A_4_PITCH * Math.pow(2, octaveDiff);
            return octaveAPitch * SCALE_TABLE.get(note);
        }

        return {
            // Public attributes
            startNote: function(note, octave) {
                if (activeNotes.has(note + octave)) {
                    activeNotes.get(note + octave).stop();
                    activeNotes.delete(note + octave);
                }
                const source = audioContext.createBufferSource();
                //const filter = filtertable.getFilter(lfo.getFrequency());
                const bufferArr = new Float32Array(wavetable.getBuffer(lfo.getFrequency(), noteToFrequency(note, octave)));
                const buffer = audioContext.createBuffer(2, bufferArr.length, SAMPLE_RATE);
                buffer.copyToChannel(bufferArr, 0);
                buffer.copyToChannel(bufferArr, 1);

                source.buffer = buffer;
                // source.connect(filter);
                source.connect(audioContext.destination);
                activeNotes.set(note + octave, source);
                console.log(activeNotes);
                source.loop = true;
                source.start();
            },
            stopNote: function(note, octave) {
                console.log(activeNotes);

                if (activeNotes.has(note + octave)) {
                    const source = activeNotes.get(note + octave);
                    source.stop();
                }
            },
            wavetable: wavetable,
            filtertable: filtertable
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
