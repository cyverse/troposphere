define(function(require) {
  "use strict";

  var _ = require('underscore'),
      Backbone = require('backbone');

  var CHANGE_EVENT = 'change';

  function buildQueryStringFromQueryParams(queryParams){
    var queryString = Object.keys(queryParams).sort().map(function(key, index){
      return key + "=" + queryParams[key];
    }.bind(this)).join("&");
    queryString = queryString ? "?" + queryString : queryString;
    return queryString;
  };

  var Store = function(attributes, options) {
    //var attrs = attributes || {};
    options || (options = {});
    this.attributes = {};
    if (options.collection) this.collection = options.collection;

    this.models = null;
    this.isFetching = false;

    this.pollingEnabled = false;
    this.modelsBuilding = [];
    this.pollingFrequency = 5*1000;

    this.isFetchingQuery = {};
    this.queryModels = {};

    this.isFetchingModel = {};

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
        var queryString = "";

        // Build the query string if queryParameters have been provided
        if(this.queryParams){
          queryString = buildQueryStringFromQueryParams(this.queryParams);
        }

        models.fetch({
          url: _.result(models, 'url') + queryString
        }).done(function(){
          this.isFetching = false;
          this.models = models;
          if(this.pollingEnabled) {
            this.models.each(this.pollNowUntilBuildIsFinished.bind(this));
          }
          this.emitChange();
        }.bind(this));
      }
    },

    fetchModel: function(modelId){
      if(!this.isFetchingModel[modelId]){
        this.isFetchingModel[modelId] = true;
        var model = new this.collection.prototype.model({
          id: modelId
        });
        model.fetch().done(function(){
          this.isFetchingModel[modelId] = false;
          this.models.add(model);
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
    },

    findWhere: function(params){
      if(!this.models) return this.fetchModels();

      var keys = Object.keys(params);

      var models = this.models.filter(function(model){
        var matchesCriteria = true;

        keys.forEach(function(key){
          if(!matchesCriteria) return;

          var tokens = key.split('.');
          if(tokens.length === 1){
            if(model.get(key) !== params[key]) matchesCriteria = false;
          }else{
            if(model.get(tokens[0])[tokens[1]] !== params[key]) matchesCriteria = false;
          }
        });

        return matchesCriteria;
      });

      return new this.collection(models);
    },

    findOne: function(params){
      if(!this.models) return this.fetchModels();

      var keys = Object.keys(params);

      var model = this.models.find(function(model){
        var matchesCriteria = true;

        keys.forEach(function(key){
          if(!matchesCriteria) return;

          var tokens = key.split('.');
          if(tokens.length === 1){
            if(model.get(key) !== params[key]) matchesCriteria = false;
          }else{
            if(model.get(tokens[0])[tokens[1]] !== params[key]) matchesCriteria = false;
          }
        });

        return matchesCriteria;
      });

      return model;
    },

    fetchWhere: function(queryParams){
      queryParams = queryParams || {};

      // Build the query string
      var queryString = buildQueryStringFromQueryParams(queryParams);

      if(this.queryModels[queryString]) return this.queryModels[queryString];

      if(!this.isFetchingQuery[queryString]) {
        this.isFetchingQuery[queryString] = true;
        var models = new this.collection();
        models.fetch({
          url: models.url + queryString
        }).done(function () {
          this.isFetchingQuery[queryString] = false;
          this.queryModels[queryString] = models;
          this.emitChange();
        }.bind(this));
      }
    },

    fetchMoreWhere: function(queryParams){
      queryParams = queryParams || {};

      // Build the query string
      var queryString = buildQueryStringFromQueryParams(queryParams);

      var searchResults = this.queryModels[queryString],
          nextUrl = searchResults.meta.next;

      if(nextUrl && !this.isFetchingQuery[queryString]){
        this.isFetchingQuery[queryString] = true;
        var moreModels = new this.collection();
        moreModels.fetch({
          url: nextUrl
        }).done(function(){
          this.isFetchingQuery[queryString] = false;
          searchResults.add(moreModels.models);
          searchResults.meta = moreModels.meta;
          this.emitChange();
        }.bind(this));
      }
    },

    // -----------------
    // Polling functions
    // -----------------

    pollNowUntilBuildIsFinished: function(model) {
      if (model.id && this.modelsBuilding.indexOf(model) < 0) {
        this.modelsBuilding.push(model);
        this.fetchNowAndRemoveIfFinished(model);
      }
    },

    pollUntilBuildIsFinished: function(model) {
      if (model.id && this.modelsBuilding.indexOf(model) < 0) {
        this.modelsBuilding.push(model);
        this.fetchAndRemoveIfFinished(model);
      }
    },

    fetchAndRemoveIfFinished: function(model) {
      if(!model.fetchFromCloud) throw new Error("model missing required method for polling: fetchFromCloud");
      if(!this.isInFinalState) throw new Error("store missing required method for polling: isInFinalState");

      setTimeout(function () {
        model.fetchFromCloud(function() {
          this.update(model);
          var index = this.modelsBuilding.indexOf(model);
          if(this.isInFinalState(model)) {
            this.modelsBuilding.splice(index, 1);
          } else {
            this.fetchAndRemoveIfFinished(model);
          }
          this.emitChange();
        }.bind(this));
      }.bind(this), this.pollingFrequency);
    },

    fetchNowAndRemoveIfFinished: function(model) {
      if(!model.fetchFromCloud) throw new Error("model missing required method for polling: fetchFromCloud");
      if(!this.isInFinalState) throw new Error("store missing required method for polling: isInFinalState");

      model.fetchFromCloud(function () {
        this.update(model);
        var index = this.modelsBuilding.indexOf(model);
        if (this.isInFinalState(model)) {
          this.modelsBuilding.splice(index, 1);
        } else {
          this.fetchAndRemoveIfFinished(model);
        }
        this.emitChange();
      }.bind(this));
    }

  });

  Store.extend = Backbone.Model.extend;

  return Store;
});
