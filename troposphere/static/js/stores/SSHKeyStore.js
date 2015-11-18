define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      SSHKeyCollection = require('collections/SSHKeyCollection');

  var SSHKeyStore = BaseStore.extend({
    collection: SSHKeyCollection
  }); 

  return new SSHKeyStore();
});
