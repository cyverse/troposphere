
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import ImageVersionMembershipCollection from 'collections/ImageVersionMembershipCollection';
import ImageVersionMembershipConstants from 'constants/ImageVersionMembershipConstants';
import MembershipCollection from 'collections/MembershipCollection';
import Membership from 'models/Membership';

let _modelsFor = {};
let _isFetchingFor = {};

let ImageVersionMembershipStore = BaseStore.extend({
    collection: ImageVersionMembershipCollection,

    initialize: function() {
        this.models = new ImageVersionMembershipCollection();
    },

    fetchModelsFor: function(imageVersionId) {
        if (!_modelsFor[imageVersionId] && !_isFetchingFor[imageVersionId]) {
            _isFetchingFor[imageVersionId] = true;
            var models = new ImageVersionMembershipCollection();
            models.fetch({
                url: models.url + "?version_id=" + imageVersionId
            }).done(function() {
                _isFetchingFor[imageVersionId] = false;

                // add models to existing cache
                this.models.add(models.models);

                // convert ImageVersionMembership collection to a MembershipCollection
                var memberships = models.map(function(version_membership) {
                    return new Membership(version_membership.get('membership'), {
                        parse: true
                    });
                });
                memberships = new MembershipCollection(memberships);

                _modelsFor[imageVersionId] = memberships;
                this.emitChange();
            }.bind(this));
        }
    },

    getMembershipsFor: function(imageversion) {
        if (!_modelsFor[imageversion.id]) return this.fetchModelsFor(imageversion.id);

        // convert ImageVersionMembership collection to an MembershipCollection
        var imageVersionMemberships = this.models.filter(function(version_membership) {
            return version_membership.get('image_version').id === imageversion.id;
        });

        var memberships = imageVersionMemberships.map(function(version_membership) {
            return new Membership(version_membership.get('group'), {
                parse: true
            });
        });
        return new MembershipCollection(memberships);
    }

});

let store = new ImageVersionMembershipStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case ImageVersionMembershipConstants.ADD_IMAGEVERSION_MEMBERSHIP:
            store.add(payload.image_versionMembership);
            break;

        case ImageVersionMembershipConstants.REMOVE_IMAGEVERSION_MEMBERSHIP:
            store.remove(payload.image_versionMembership);
            break;

        case ImageVersionMembershipConstants.EMIT_CHANGE:
            break;

        default:
            return true;
    }

    if (!options.silent) {
        store.emitChange();
    }

    return true;
});

export default store;
