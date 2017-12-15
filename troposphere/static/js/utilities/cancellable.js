// Transform a function so that it can be cancelled.
//
// let sayHi = cancellable(() =>  console.log('hi'))
// sayHi.cancel()
// sayHi()  -- produces no output
export default function(func) {
    let cancelled = false;
    let cancellable = (...args) => cancelled ? null : func.apply(null, args);
    cancellable.cancel = () => { cancelled = true };
    return cancellable;
}
