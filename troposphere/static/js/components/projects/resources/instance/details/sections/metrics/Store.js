define(function(require) {

  // Never return the inner datastruct data. This module depends on that assumption.
  var Store = function() {
    var data = {};

    this.has = function(key) {
      return data[JSON.stringify(key)] != undefined;
    }
    this.get = function(key) {
      return data[JSON.stringify(key)];
    }
    this.set = function(key, obj) {
      data[JSON.stringify(key)] = obj;
    }
    this.remove = function(key) {
      delete data[JSON.stringify(key)];
    }
    this.removeAll = function(key) {
      data = {};
    }

  }

  return Store;
});
