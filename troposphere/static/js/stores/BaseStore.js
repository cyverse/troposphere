define(function(require) {
  "use strict";

  var _ = require('underscore'),
      Backbone = require('backbone');

  var CHANGE_EVENT = 'change';

  var Store = function(attributes, options) {
    //var attrs = attributes || {};
    options || (options = {});
    this.attributes = {};
    if (options.collection) this.collection = options.collection;

    this.models = null;
    this.isFetching = false;

    this.initialize.apply(this, arguments);
  };

  _.extend(Store.prototype, Backbone.Events, {

    // ---------------
    // Event listeners
    // ---------------

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.off(CHANGE_EVENT, callback);
    },

    emitChange: function() {
      this.trigger(CHANGE_EVENT);
    },

    // --------------
    // CRUD functions
    // --------------

    add: function(model){
      this.models.add(model);
    },

    update: function(model){
      var existingModel = this.models.get(model);
      if(existingModel) {
        this.models.add(model, {merge: true});
      }else{
        console.error("Model doesn't exist: " + model.id || model.cid);
      }
    },

    remove: function(model){
      this.models.remove(model);
    },

    // --------------
    // Core functions
    // --------------

    initialize: function(){},

    fetchModels: function () {
      if (!this.models && !this.isFetching) {
        this.isFetching = true;
        var models = new this.collection();
        models.fetch().done(function(){
          this.isFetching = false;
          this.models = models;
          this.emitChange();
        }.bind(this));
      }
    },

    getAll: function () {
      if(!this.models) {
        this.fetchModels()
      }else{
        return this.models;
      }
    },

    get: function (modelId) {
      if(!this.models) {
        this.fetchModels();
      } else {
        return this.models.get(modelId);
      }
    }

  });

  Store.extend = Backbone.Model.extend;

  return Store;
});
