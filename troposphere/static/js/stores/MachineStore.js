define(function (require) {

  var _ = require('underscore'),
      Store = require('stores/Store'),
      Machine = require('models/Machine');

  var _machines = {};
  var _isFetching = {};

  function fetchMachine(providerId, identityId, machineId){
    if(!_isFetching[machineId]) {
      _isFetching[machineId] = true;
      var machine = new Machine({id: machineId}, {
        provider_id: providerId,
        identity_id: identityId
      });

      machine.fetch().done(function () {
        _isFetching[machineId] = false;
         _machines[machineId] = machine;
        MachineStore.emitChange();
      });
    }
  }

  var MachineStore = {

    get: function (providerId, identityId, machineId) {
      console.warn("Function shouldn't be used...");
      if (!_machines[machineId]) {
        fetchMachine(providerId, identityId, machineId);
      }
      return _machines[machineId];
    }

  };

  _.extend(MachineStore, Store);

  return MachineStore;

});
