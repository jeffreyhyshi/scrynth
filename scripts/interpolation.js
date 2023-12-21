/**
 * Interpolation functions.
 * These take an array of user defined {wave, pos} objects and a position, returning a single wave
 * userWaves should be sorted. Each wave must be the same length.
 */

const interpolation = {
    linearInterpolation: function(userWaves, lfoPosition) {
        if (lfoPosition < userWaves[0].pos) {
            let userWave = userWaves[userWaves.length - 1];
            let nextUserWave = userWave[0];
            let posBetweenWaves = (1 - userWave.pos + lfoPosition) / (1 - userWave.pos + nextUserWave.pos);
            return utilities.linterp(userWave.wave, nextUserWave.wave, posBetweenWaves);
        }

        for (let i = 0; i < userWaves.length; i += 1) {
            let userWave = userWaves[i];
            if (lfoPosition >= userWave.pos) {
                let nextUserWave = i + 1 < userWaves.length ? userWaves[i + 1] : userWaves[0];

                // normalize position between waves to [0,1]
                let posBetweenWaves;
                if (nextUserWave.pos > userWave.pos) {
                    posBetweenWaves = (nextUserWave.pos - lfoPosition) / (nextUserWave.pos - userWave.pos);
                } else {
                    posBetweenWaves = (1 - lfoPosition) / (1 - userWave.pos + nextUserWave.pos);
                }

                return utilities.linterp(userWave.wave, nextUserWave.wave, posBetweenWaves);
            }
        }
    }
}
