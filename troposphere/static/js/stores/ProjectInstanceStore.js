
import _ from 'underscore';
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import ProjectInstanceCollection from 'collections/ProjectInstanceCollection';
import Constants from 'constants/ProjectInstanceConstants';
import InstanceCollection from 'collections/InstanceCollection';
import Instance from 'models/Instance';
import stores from 'stores';

let _modelsFor = {};
let _isFetchingFor = {};
let _pendingProjectInstances = new InstanceCollection();

function addPending(model) {
    _pendingProjectInstances.add(model);
}

function removePending(model) {
    _pendingProjectInstances.remove(model);
}


//
// Model Store
//

let ProjectInstanceStore = BaseStore.extend({
    collection: ProjectInstanceCollection,

    initialize: function() {
        this.models = new ProjectInstanceCollection();
    },

    fetchModelsFor: function(projectId) {
        if (!_modelsFor[projectId] && !_isFetchingFor[projectId]) {
            _isFetchingFor[projectId] = true;
            var models = new ProjectInstanceCollection();
            models.fetch({
                url: models.url + "?project__id=" + projectId
            }).done(function() {
                _isFetchingFor[projectId] = false;

                // add models to existing cache
                this.models.add(models.models);

                // convert ProjectInstance collection to an InstanceCollection
                var instances = models.map(function(pi) {
                    return new Instance(pi.get('instance'), {
                        parse: true
                    });
                });
                instances = new InstanceCollection(instances);

                _modelsFor[projectId] = instances;
                this.emitChange();
            }.bind(this));
        }
    },

    getInstancesFor: function(project) {
        var allInstances = stores.InstanceStore.getAll();
        if (!_modelsFor[project.id]) return this.fetchModelsFor(project.id);
        if (!allInstances) return;

        var instances = this.models.filter(function(pi) {
            // filter out irrelevant project instances (not in target project)
            return pi.get('project').id === project.id;
        }).filter(function(pi) {
            // filter out the instances that don't exist (not in local cache)
            return allInstances.get(pi.get('instance').id);
        }).map(function(pi) {
            // return the actual instances
            return allInstances.get(pi.get('instance').id);
        });

        var pendingInstances = _pendingProjectInstances.filter(function(pi) {
            // filter out irrelevant project instances (not in target project)
            return pi.get('project').id === project.id;
        }).filter(function(pi) {
            // filter out the instances that don't exist (not in local cache)
            return allInstances.get(pi.get('instance'));
        }).map(function(pi) {
            // return the actual instances
            return allInstances.get(pi.get('instance'));
        });

        return new InstanceCollection(instances.concat(pendingInstances));
    },

    getInstancesForProjectOnProvider: function(project, provider) {
        // get instances in project
        var instances = this.getInstancesFor(project);

        // filter out instances not on provider
        var instances = instances.filter(function(i) {
            return i.get('provider').id === provider.id;
        });

        return new InstanceCollection(instances);
    }

});


let store = new ProjectInstanceStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case Constants.ADD_PROJECT_INSTANCE:
            store.add(payload.projectInstance);
            break;

        case Constants.REMOVE_PROJECT_INSTANCE:
            store.remove(payload.projectInstance);
            break;

        case Constants.ADD_PENDING_PROJECT_INSTANCE:
            addPending(payload.projectInstance);
            break;

        case Constants.REMOVE_PENDING_PROJECT_INSTANCE:
            removePending(payload.projectInstance);
            break;

        case Constants.EMIT_CHANGE:
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
