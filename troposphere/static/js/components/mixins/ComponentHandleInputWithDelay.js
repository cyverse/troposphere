/*

   This mixin extends any component with a resettable timer. 

   For example:

       this.callIfNotInterruptedAfter(300, () => console.log("hi"));
       this.callIfNotInterruptedAfter(300, () => console.log("hi"));
       this.callIfNotInterruptedAfter(300, () => console.log("hi"));

    Will result in a single call to: 

        console.log("hi")

    Each additional command resets the timer.

*/
export default { 
    componentWillMount: function() {
        this.fnCallLock = null;
    },

    awaitingTimeout: function() {
        return this.fnCallLock !== null;
    },

    callIfNotInterruptedAfter: function (time, callback) {
        // If lock exists, forget an earlier call attempt
        if (this.fnCallLock) {
            clearTimeout(this.fnCallLock);
        }

        // When our timeout expires, remove the lock
        this.fnCallLock = setTimeout(() => {
          this.fnCallLock = null;
          callback();
        }, time);
    }
};
