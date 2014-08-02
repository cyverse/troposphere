define(
  [
    'underscore',
    'stores/Store',
    'models/Machine',
    'dispatchers/AppDispatcher'
  ],
  function (_, Store, Machine, AppDispatcher) {

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
        if (!_machines[machineId]) {
          fetchMachine(providerId, identityId, machineId);
        }
        return _machines[machineId];
      }

    };

    AppDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        // case MachineActions.ACTION:
        //   action(action.data);
        //   break;
      }

      return true;
    });

    _.extend(MachineStore, Store);

    return MachineStore;

  });
