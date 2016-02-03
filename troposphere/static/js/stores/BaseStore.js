define(function (require) {
  "use strict";

  var _ = require('underscore'),
    Backbone = require('backbone');

  var CHANGE_EVENT = 'change';

  function buildQueryStringFromQueryParams(queryParams) {
    var queryString = Object.keys(queryParams).sort().map(function (key, index) {
      return key + "=" + queryParams[key];
    }.bind(this)).join("&");
    queryString = queryString ? "?" + queryString : queryString;
    return queryString;
  }

  var Store = function (attributes, options) {
    // models: primary local cache, stores a collection of models
    this.models = null;

    // isFetching: True or false depending on whether this.models is being
    // fetch from the server. Used to prevent multiple server calls for the same data.
    this.isFetching = false;

    // pollingEnabled: True if this store should poll models 
    // pollingModels: A dictionary(model, callback), the presence of a model indicates polling
    //    status, see pollWhile
    // pollingFrequency: frequency in milliseconds of when the models should be polled
    this.pollingEnabled = false;
    this.pollingModels = {};
    this.pollingFrequency = 5 * 1000;

    // isFetchingQuery: stores query strings as keys and denotes whether that data is already
    // being fetched from the server. Used to prevent multiple server calls for the same data.
    //
    // queryModels: dictionary that uses query strings as keys and stores the resulting
    // collection as the value
    this.isFetchingQuery = {};
    this.queryModels = {};

    // isFetchingModel: dictionary of ids as keys and individual models as the values.  Used
    // when we need to make sure to fetch an individual model
    this.isFetchingModel = {};

    // isFetchingMore: True or false depending on whether the next page of data
    // for this.models is being fetched
    this.isFetchingMore = false;

    this.initialize.apply(this, arguments);
  };

  _.extend(Store.prototype, Backbone.Events, {

    // ---------------
    // Event listeners
    // ---------------

    addChangeListener: function (callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
      this.off(CHANGE_EVENT, callback);
    },

    emitChange: function () {
      this.trigger(CHANGE_EVENT);
    },
    generateQueryString: function(query_params) {
      return buildQueryStringFromQueryParams(query_params);
    },
    // --------------
    // CRUD functions
    // --------------

    add: function (model) {
      this.models.add(model);
    },

    update: function (model) {
      var existingModel = this.models.get(model);
      if (existingModel) {
        this.models.add(model, {merge: true});
      } else {
        console.error("Model doesn't exist: " + model.id || model.cid);
      }
    },

    remove: function (model) {
      this.models.remove(model);

      // Remove model from polling dictionary
      delete this.pollingModels[model.cid];
    },

    // --------------
    // Core functions
    // --------------

    // called as the last step in the constructor - should be overridden if you need to
    // modify any of the default store values (this.models, pollingFrequency, etc.)
    initialize: function () {
    },

    // Fetch the first page of data from the server
    fetchModels: function () {
      if (!this.models && !this.isFetching) {
        this.isFetching = true;
        var models = new this.collection();
        var queryString = "";

        // Build the query string if queryParameters have been provided
        if (this.queryParams) {
          queryString = buildQueryStringFromQueryParams(this.queryParams);
        }

        models.fetch({
          url: _.result(models, 'url') + queryString
        }).done(function () {
          this.isFetching = false;
          this.models = models;
          if (this.pollingEnabled) {
            this.models.each(this.pollNowUntilBuildIsFinished.bind(this));
          }
          this.emitChange();
        }.bind(this));
      }
    },

    // Fetch a specific model from the server (based on the provided id)
    fetchModel: function (modelId) {
      if (!this.isFetchingModel[modelId]) {
        this.isFetchingModel[modelId] = true;
        var model = new this.collection.prototype.model({
          id: modelId
        });
        model.fetch().done(function () {
          this.isFetchingModel[modelId] = false;
          this.models.add(model);
          this.emitChange();
        }.bind(this));
      }
    },

    // Returns the entire local cache, everything in this.models
    getAll: function () {
      if (!this.models) {
        this.fetchModels()
      } else {
        return this.models;
      }
    },

    // Fetch the first page and replace models with results
    fetchFirstPage: function() {
      if (!this.isFetching) {
        this.isFetching = true;

        var models = new this.collection();

        models.fetch({
            url: models.url
        }).done(function () {
            this.isFetching = false;
            this.models = models;
            this.emitChange();
          }.bind(this));
      }
    },

    // same as fetchFirstPage, but with URL query params
    fetchFirstPageWhere: function(queryParams) {
      if (!this.isFetching) {
        this.isFetching = true;
        queryParams = queryParams || {};
        var queryString = buildQueryStringFromQueryParams(queryParams);
        var models = new this.collection();

        models.fetch({
            url: models.url + queryString
        }).done(function () {
            this.isFetching = false;
            this.models = models;
            this.emitChange();
          }.bind(this));
      }
    },

    // Returns a specific model if it exists in the local cache with the side
    // effect of fetching models
    get: function (modelId) {
      if (!this.models) {
        this.fetchModels();
      } else {
        return this.models.get(modelId);
      }
    },

    // Check the local cache for a model
    has: function(modelId) {
        return this.models.get(modelId) != undefined;
    },

    // Looks through the local cache and returns any models matched the provided parameters
    // params: Object, like {name: 'example'} or {'provider.id': 1}
    // provided params can be at most 1 extra level deep ('provider.id' or 'provider')
    findWhere: function (params) {
      if (!this.models) return this.fetchModels();

      var keys = Object.keys(params);

      var models = this.models.filter(function (model) {
        var matchesCriteria = true;

        keys.forEach(function (key) {
          if (!matchesCriteria) return;

          var tokens = key.split('.');
          if(tokens.length === 1) {
            if(model.get(key) !== params[key]) matchesCriteria = false;
          }else{
            var lookup = model.get(tokens[0])
            if(lookup[tokens[1]] !== params[key]) matchesCriteria = false;
          }
        });

        return matchesCriteria;
      });

      return new this.collection(models);
    },

    // Looks through the local cache and returns the first model matching the given params
    // params: Object, like {name: 'example'} or {'provider.id': 1}
    // provided params can be at most 1 extra level deep ('provider.id' or 'provider')
    findOne: function (params) {
      if (!this.models) return this.fetchModels();

      var keys = Object.keys(params);

      var model = this.models.find(function (model) {
        var matchesCriteria = true;

        keys.forEach(function (key) {
          if (!matchesCriteria) return;

          var tokens = key.split('.');
          if(tokens.length === 1) {
            if(model.get(key) !== params[key]) matchesCriteria = false;
          }else{
            var lookup = model.get(tokens[0])
            if(lookup[tokens[1]] !== params[key]) matchesCriteria = false;
          }
        });

        return matchesCriteria;
      });

      return model;
    },

    // Fetches the next page of data for this.models
    fetchMore: function () {
      var nextUrl = this.models.meta.next;

      if (nextUrl && !this.isFetchingMore) {
        this.isFetchingMore = true;
        var moreModels = new this.collection();
        moreModels.fetch({
          url: nextUrl
        }).done(function () {
          this.isFetchingMore = false;
          this.models.add(moreModels.models, { merge: true });
          this.models.meta = moreModels.meta;
          this.emitChange();
        }.bind(this));
      }
    },

    // Fetches the first page of data for the given set of queryParams
    // Example: params = {page_size: 1000, search: 'featured'}
    // will be convereted to ?page_size=1000&search=featured
    fetchWhereNoCache: function(queryParams) {
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

    fetchWhere: function(queryParams) {
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

    // Fetches the next page of data for the given set of queryParams
    // Example: params = {page_size: 1000, search: 'featured'}
    // will be convereted to ?page_size=1000&search=featured
    fetchMoreWhere: function (queryParams) {
      queryParams = queryParams || {};

      // Build the query string
      var queryString = buildQueryStringFromQueryParams(queryParams);

      var searchResults = this.queryModels[queryString],
        nextUrl = searchResults.meta.next;

      if (nextUrl && !this.isFetchingQuery[queryString]) {
        this.isFetchingQuery[queryString] = true;
        var moreModels = new this.collection();
        moreModels.fetch({
          url: nextUrl
        }).done(function () {
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

    // Poll model while whileFunc(model) returns true.
    pollWhile: function(model, whileFunc) {
        if (!model.fetchFromCloud)
            throw new Error("model missing required method for polling: fetchFromCloud");
         
        // If already polling, mutate the callback and exit
        if (this.pollingModels[model.cid]) {
            this.pollingModels[model.cid] = whileFunc;
            return;
        }

        // Set the new polling function
        this.pollingModels[model.cid] = whileFunc;

        // Wrapper gets called every pollingFrequency, calling the latest
        // whileFunc
        var wrapper = function() {
            model.fetchFromCloud(function(response) {

                // If no longer polling, exit
                if (!this.pollingModels[model.cid])
                    return;

                // Use latest polling func
                var keepPolling = this.pollingModels[model.cid](model, response);

                if (this.has(model))
                    this.update(model);
                this.emitChange();

                if (keepPolling) {
                    setTimeout(wrapper, this.pollingFrequency);
                } else {
                    delete this.pollingModels[model.cid];
                }
            }.bind(this));
        }.bind(this);

        // Kickstart polling
        wrapper();
    },

    // Fetches the models state immediately and then sets up to be polled if not in a final state
    pollNowUntilBuildIsFinished: function (model) {
      if (!this.isInFinalState) throw new Error("store missing required method for polling: isInFinalState");

      if (model.id) {
        this.pollWhile(model, _.negate(this.isInFinalState));
      }
    },

    // Delays before polling, should be removed...
    pollUntilBuildIsFinished: function (model) {
        setTimeout(this.pollNowUntilBuildIsFinished.bind(this, model), this.pollingFrequency);
    },

  });

  Store.extend = Backbone.Model.extend;

  return Store;
});
