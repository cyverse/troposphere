define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
    AllocationConstants = require('constants/AllocationConstants'),
    Allocation = require('models/Allocation'),
    Utils = require('./Utils'),
    stores = require('stores');

  return {

    create: function(params){

      var allocation = new Allocation({
        threshold: parseInt(params.threshold),
        delta: parseInt(params.delta)
      });

      allocation.save().done(function(){
        Utils.dispatch(AllocationConstants.CREATE_ALLOCATION, {allocation: allocation}, {silent: false});
      }).fail(function(response){
        console.log(response);
      });
    }

  };

});
