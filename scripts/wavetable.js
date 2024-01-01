/**
 * Wavetable. Uses a provided interpolation function to generate the full buffer of waves.
 * Memoizes the buffers produced, clearing memory whenever userWaves is updated.
 */
const Wavetable = (function() {
    const SAMPLE_RATE = 44100;

    // Singleton instance
    let instance;

    function init() {
        // Waves defined by the user, sorted by position.
        let userWaves = [];
        // Interpolation function, set to linear by default
        let interpolationFunction = Interpolation.linearInterpolation;
        // Memoized tuned waves
        let memoizedTunedWaves = new Map();

        // stretch/compress the actual wave with linterp/note sampling
        function tunedWaveFromUserWave(wave, noteFreq) {
            let result = [];
            // calculate number of samples needed to describe the wave at the given frequency
            let numSamples = Math.floor(SAMPLE_RATE / noteFreq);
            // generate the wave
            for (let i = 0; i < numSamples; i += 1) {
                let samplePos = i * wave.length / numSamples;
                let interpPos = samplePos - Math.floor(samplePos);
                let linterpSample = (1 - interpPos) * wave[Math.floor(samplePos)] + interpPos * wave[Math.ceil(samplePos)];
                result.push(linterpSample);
            }
            return result;
        }

        return {
            // Memoizes and returns a wave that is 1/lfoFreq secs long, with frequency noteFreq
            getBuffer: function(lfoFreq, noteFreq) {
                if (memoizedTunedWaves.has(noteFreq)) {
                    return memoizedTunedWaves.get(noteFreq);
                }
                let result = []
                let numWaves = SAMPLE_RATE / (lfoFreq * Math.floor(SAMPLE_RATE / noteFreq));
                let tunedUserWaves = userWaves.map((userWave) => {
                    return {wave: tunedWaveFromUserWave(userWave.wave, noteFreq), pos: userWave.pos};
                });
                for (let i = 0; i < numWaves; i++) {
                    result.push(...interpolationFunction(tunedUserWaves, i / numWaves));
                }
                memoizedTunedWaves.set(noteFreq, result);
                return result;
            },
            setInterpolationFunction: function(interpFunc) {
                interpolationFunction = interpFunc;
            },
            addUserWave: function(newUserWave) {
                let insertIndex = 0;
                for (; insertIndex < userWaves.length; insertIndex += 1) {
                    if (newUserWave.pos < userWaves[insertIndex].pos) {
                        break;
                    }
                }
                userWaves.splice(insertIndex, 0, newUserWave);
                memoizedTunedWaves.clear();
            },
            removeUserWave: function(userWaveToRemove) {
                let removeIndex = 0;
                for (; removeIndex < userWaves.length; removeIndex += 1) {
                    if (userWaveToRemove === userWaves[removeIndex]) {
                        break;
                    }
                }
                userWaves.split(removeIndex, 1);
                memoizedTunedWaves.clear();
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