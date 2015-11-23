import BaseStore from 'stores/BaseStore';
import SSHKeyCollection from 'collections/SSHKeyCollection';

var SSHKeyStore = BaseStore.extend({
    collection: SSHKeyCollection
});

export default new SSHKeyStore();
