// utilities for testing etc


const utilities = {
    // produces an array with a single cycle [-1, 1] square wave over len
    squareWave: function(len) {
        let result = [];
        for (let i = 0; i < len; i += 1) {
            result.push(i / result > 0.5 ? 1 : -1);
        }
        return result;
    },
    // produces an array with a single cycle [-1, 1] sine wave over len
    sineWave: function(len) {
        let result = [];
        for (let i = 0; i < len; i += 1) {
            result.push(Math.sin(2 * Math.PI * i / len));
        }
    },
    linterp: function(arr1, arr2, pos) {
        let result = [];
        for (let j = 0; j < arr1.length && j < arr2.length; j += 1) {
            result.push(arr1[j] * pos + arr2[j] * (1 - pos));
        }
        return result
    }
}
var squareWave = function() {

}

var sineWave = function() {

}