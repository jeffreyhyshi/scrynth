/**
 * Interpolation functions.
 * These take an array of user defined {wave, pos} objects and a position, returning a single wave
 * userWaves should be sorted. Each wave must be the same length.
 */

const Interpolation = {
    linearInterpolation: function(userWaves, lfoPosition) {
        if (!userWaves || !userWaves.length > 0) {
            return [];
        }

        for (let i = 0; i < userWaves.length; i += 1) {
            let userWave = userWaves[i];
            if (userWave.pos > lfoPosition) {
                let prevUserWave = i > 0 ? userWaves[i - 1] : userWaves[userWaves.length - 1];
                // normalize position between waves to [0,1]
                let posBetweenWaves;
                if (prevUserWave.pos > userWave.pos) {
                    posBetweenWaves = (1 - prevUserWave.pos + lfoPosition) / (1 - prevUserWave.pos + userWave.pos)
                } else {
                    posBetweenWaves = (lfoPosition - prevUserWave.pos) / (userWave.pos - prevUserWave.pos)
                }
                return Utilities.linterp(prevUserWave.wave, userWave.wave, posBetweenWaves);
            }
        }
        // lfo position is greater than any user wave
        let prevUserWave = userWaves[userWaves.length - 1];
        let userWave = userWaves[0];
        let posBetweenWaves = (lfoPosition - prevUserWave.pos) / (1 - prevUserWave.pos + userWave.pos);
        return Utilities.linterp(prevUserWave.wave, userWave.wave, posBetweenWaves);
    }
}
