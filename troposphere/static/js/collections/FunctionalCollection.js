import 'backbone';

// Decorate any collection function, so that it returns a collection rather
// than an array
var fix = function(f) {
    return function(...args) {
        return new this.constructor(f.apply(this, args));
    }
}

// Export variants of common functions, to operate on and return collections
// For example:
//    var c = new Collection();
//    c.cmap(add1)
//     .cfilter(greaterThan1)
//     ...
export default {
    cmap: fix(new Backbone.Collection().map),
    cfilter: fix(new Backbone.Collection().filter),
    csome: fix(new Backbone.Collection().some),
    cwhere: fix(new Backbone.Collection().where),
    csort: fix(new Backbone.Collection().sort),
}
