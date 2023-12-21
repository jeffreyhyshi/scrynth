/**
 * Wavetable. Uses a provided interpolation function to generate the waves to cycle through.
 */
const wavetable = (function() {
    // Singleton instance
    let instance;

    function init() {
        // Waves defined by the user, sorted by position.
        let userWaves = [];
        // Interpolation function, set to linear by default
        let interpolationFunction = interpolation.linearInterpolation;

        return {
            // Current wave
            currentWave: function(position) {
                return interpolationFunction(userWaves, position);
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
            },
            removeUserWave: function(userWaveToRemove) {
                let removeIndex = 0;
                for (; removeIndex < userWaves.length; removeIndex += 1) {
                    if (userWaveToRemove === userWaves[removeIndex]) {
                        break;
                    }
                }
                userWaves.split(removeIndex, 1);
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