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

    // This function is bad, but its just a symptom. A store should not depend
    // on another store, and contain duplicate data with that dependency. Is
    // the InstanceStore or ProjectInstanceStore right? It depends on whom you
    // ask.
    getInstancesFor: function (project) {
      var allInstances = stores.InstanceStore.getAll();
      if (!_modelsFor[project.id]) return this.fetchModelsFor(project.id);
      if (!allInstances) return;

      // Filter instances belonging to the project
      var instances = allInstances.filter(function (i) {
          return _.contains(i.get('projects'), project.id);
      });

      return new InstanceCollection(instances);
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
