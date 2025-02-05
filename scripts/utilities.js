// Utilities for testing etc


const Utilities = {
    // produces an array with a single cycle [-1, 1] square wave over len
    squareWave: function(len) {
        let result = [];
        for (let i = 0; i < len; i += 1) {
            result.push(i / len > 0.5 ? -1 : 1);
        }
        return result;
    },
    // produces an array with a single cycle [-1, 1] sine wave over len
    sineWave: function(len, cyclesOpt, phaseShiftOpt) {
        let result = [];
        let numCycles = cyclesOpt ? cyclesOpt : 1
        let phaseShift = phaseShiftOpt ? phaseShiftOpt : 0;
        for (let i = 0; i < len; i += 1) {
            result.push(Math.sin(numCycles * (2 * Math.PI * i / len + phaseShift)));
        }
        return result;
    },
    // produces an array with a single cycle [-1, 1] sawtooth over len
    sawtoothWave: function(len) {
        let result = [];
        for (let i = 0; i < len; i += 1) {
            result.push((2 - 2 * i / len) - 1);
        }
        return result;
    },
    // produces an array with length min(arr1.length, arr2.length), linearly interpolating values from the two arrays at position pos
    linterp: function(arr1, arr2, pos) {
        let result = [];
        for (let j = 0; j < arr1.length && j < arr2.length; j += 1) {
            result.push(arr1[j] * (1 - pos) + arr2[j] * pos);
        }
        return result
    },
    // given a sorted array of object with property .pos in [0,1], and lfoPosition,
    // calculates the relative [0,1] position that lfoPosition occupies between two objects.
    // returns an object {prev: <obj>, next: <obj>, pos: <relative position>}
    normalizedPosition: function(objectsWithPos, lfoPosition) {
        if (!objectsWithPos || !objectsWithPos.length > 0) {
            return 0;
        }

        for (let i = 0; i < objectsWithPos.length; i += 1) {
            let posObject = objectsWithPos[i];
            if (posObject.pos > lfoPosition) {
                let prevPosObject = i > 0 ? objectsWithPos[i - 1] : objectsWithPos[objectsWithPos.length - 1];
                // normalize position between waves to [0,1]
                let posBetweenObjects;
                if (prevPosObject.pos > posObject.pos) {
                    posBetweenObjects = (1 - prevPosObject.pos + lfoPosition) / (1 - prevPosObject.pos + posObject.pos)
                } else {
                    posBetweenObjects = (lfoPosition - prevPosObject.pos) / (posObject.pos - prevPosObject.pos)
                }
                return {prev: prevPosObject.wave, next: posObject.wave, pos: posBetweenObjects};
            }
        }
        // lfo position is greater than any user wave
        let prevPosObject = objectsWithPos[objectsWithPos.length - 1];
        let posObject = objectsWithPos[0];
        let posBetweenObjects = (lfoPosition - prevPosObject.pos) / (1 - prevPosObject.pos + posObject.pos);
        return {prev: prevPosObject.wave, next: posObject.wave, pos: posBetweenObjects};
    }
}