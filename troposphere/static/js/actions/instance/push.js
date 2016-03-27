define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
    InstanceState = require('models/InstanceState'),
    Utils = require('../Utils');

  var receivePush = function(message) {
    var data = JSON.parse(message.data);
    //Formalized message structure: {
    //  event: 'instance_update',
    //  resource_id: 'instance_uuid',
    //  payload: {'changed_key':'changed_val', ...}
    //}
    if (data.event == "instance_update") {
      handlePushInstanceUpdate(data)
    }
    return message;
  };
  var handlePushInstanceUpdate = function(data) {
    var instances = stores.InstanceStore.getAll(),
        instance = instances.find({'uuid': data.resource_id}),
        payload = data.payload;
    if (payload.hasOwnProperty('status')) {
        payload.state = new InstanceState({status_raw: payload.status})
    }
    actions.InstanceActions.pushUpdate(instance, data.payload);

  }
  return {
    initiatePush: function (params) {
        let socket = start_socket_session('/push/instances', '', receivePush);
        return socket;
    },
  };

});
