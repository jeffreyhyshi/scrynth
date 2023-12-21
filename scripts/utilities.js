// utilities for testing etc


const utilities = {
    squareWave: function() {

    },
    sineWave: function() {

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