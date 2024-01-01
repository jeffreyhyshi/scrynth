/**
 * Simple sawtooth Lfo.
 */
const Lfo = (function() {
    function init(freq, low, hi) {
        var frequency = freq;
        var startTime;
        var lowVal = low;
        var highVal = hi;

        return {
            // Public attributes
            getFrequency: function() {
                return frequency;
            },
            setFrequency: function(freq) {
                frequency = freq;
            },
            getValue: function() {
                if (!startTime) {
                    return 0;
                } else {
                    let delta = Date.now() - startTime;
                    let cycleMillis = Math.floor(1000 / frequency);
                    let pos = (delta % cycleMillis) / cycleMillis;
                    return lowVal * (1 - pos) + highVal * pos;
                }
            },
            trigger: function() {
                startTime = Date.now();
            }
        }
    }

    return {
      get: function(freq, low, hi) {
          return init(freq, low, hi);
      }
  }
})();