define(function (require) {

  var BaseStore = require('stores/BaseStore'),
    SizeCollection = require('collections/SizeCollection');

  var SizeStore = BaseStore.extend({
    collection: SizeCollection,

    queryParams: {
      page_size: 100
    }
  });

  SizeStore.prototype.filterWhereGreaterThanOrEqualTo = function(params){
    var results = [];
    var shouldAdd;

    this.models.each(function(model){
      shouldAdd = true;
      for(param in params){ 
        if(model.get(param) < params[param]){
          shouldAdd = false;
        }
      }
      if(shouldAdd){
        results.push(model);
      }
    });
    
    return results;
  }

  var store = new SizeStore();

  return store;

});
