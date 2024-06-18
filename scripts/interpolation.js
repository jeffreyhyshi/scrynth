/**
 * Interpolation functions.
 * These take an array of user defined {wave, pos} objects and a position, returning a single wave
 * userWaves should be sorted. Each wave must be the same length.
 */

const Interpolation = {
    linearInterpolation: function(userWaves, lfoPosition) {
        const wavePosition = Utilities.normalizedPosition(userWaves, lfoPosition);
        return Utilities.linterp(wavePosition.prev, wavePosition.next, wavePosition.pos);
    }
}
