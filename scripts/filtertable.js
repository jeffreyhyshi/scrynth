/**
 * Wrapper class that produces an appropriate BiQuadFilter given the current configurations.
 */
const Filtertable = (function() {
    // Singleton instance
    let instance;

    function init(audioContext) {
        // Filter configs defined by the user, sorted by position.
        // Filter configs are {freq: <number>, q: <number>, pos: <number>}
        let userFilterConfigs = [];
        let filterType = "lowpass";

        // Retrieve filter value at a certain lfoPositiona
        function getFilterValueAtPosition(lfoPosition) {
            const filterPosition = Utilities.normalizedPosition(userFilterConfigs, lfoPosition);
            return {
                freq: filterPosition.prev.freq * filterPosition.pos + filterPosition.next.freq * (1 - filterPosition.pos),
                q: filterPosition.prev.q * filterPosition.pos + filterPosition.next.q * (1 - filterPosition.pos)
            }
        }

        function scheduleFilterRamps(filter, duration) {
            let prevTime = 0;
            for (let i = 0; i < userFilterConfigs.length; i += 1) {
                let filterConfig = userFilterConfigs[i];
                if (filterConfig.pos > 0) {
                    filter.frequency.linearRampToValueAtTime(filterConfig.freq, filterConfig.pos * duration - prevTime);
                    filter.Q.linearRampToValueAtTime(filterConfig.q, filterConfig.pos * duration - prevTime);
                    prevTime = filterConfig.pos * duration;
                }
            }
            filter.frequency.linearRampValueAtTime(initialFilterConfig.freq, duration - prevTime);
            filter.Q.linearRampValueAtTime(initialFilterConfig.q, duration - prevTime);

             // ensure that the filter ramps are re-added after each cycle
             setTimeout(function() {
                scheduleFilterRamps(filter, duration);
            }, duration)
        }

        return {
            // Returns a new BiquadFilter instance that ramps to the values in userFilterConfigs over 1/lfoFreq seconds
            getFilter: function(lfoFreq) {
                const filter = audioContext.createBiquadFilter();
                const duration = 1 / lfoFreq;
                if (userFilterConfigs.length > 0) {
                    const initialFilterConfig = getFilterValueAtPosition(0);
                    filter.frequency.value = initialFilterConfig.freq;
                    filter.Q.value = initialFilterConfig.q;
                    filter.type = filterType;
                }
                if (userFilterConfigs.length <= 1) {
                    return filter;
                }
                scheduleFilterRamps(filter, duration);
               
                return filter;
            },
            addUserFilterConfig: function(userFilterConfig) {
                
            },
            removeUserFilterConfig: function(userFilterConfigToRemove) {
                
            }
        }
    }

    return {
        getInstance: function(audioContext) {
            if (!instance) {
                instance = init(audioContext);
            }
  
            return instance;
        }
    }
})();