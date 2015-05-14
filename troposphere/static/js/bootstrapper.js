define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        React = require('react'),
        SplashScreen = require('components/SplashScreen.react');

    // Disconnect all Backbone Events from Models and Collections
    Object.keys(Backbone.Events).forEach(function(functionName){
      Backbone.Model.prototype[functionName] = function(){};
      Backbone.Collection.prototype[functionName] = function(){};
    });

    //Backbone.Model.prototype.parse = function(resp, options) {
    //  if(resp.id) resp.id = String(resp.id);
    //  return resp;
    //};

    Backbone.Collection.prototype.get = function(obj) {
      if (obj == null) return void 0;
      return _.find(this.models, function(model){
        return model.id == obj || model.id === obj.id || model.cid === obj.cid;
        //return model.id == String(obj) || model.id === String(obj.id) || model.cid === obj.cid;
      });
    };

    // Register which stores the application should use
    var stores = require('stores');
    stores.ApplicationStore        = require('stores/ApplicationStore');
    stores.IdentityStore           = require('stores/IdentityStore');
    stores.ImageBookmarkStore      = require('stores/ImageBookmarkStore');
    stores.InstanceHistoryStore    = require('stores/InstanceHistoryStore');
    stores.InstanceStore           = require('stores/InstanceStore');
    stores.InstanceTagStore        = require('stores/InstanceTagStore');
    stores.MaintenanceMessageStore = require('stores/MaintenanceMessageStore');
    stores.ProfileStore            = require('stores/ProfileStore');
    stores.ProjectStore            = require('stores/ProjectStore');
    stores.ProjectInstanceStore    = require('stores/ProjectInstanceStore');
    stores.ProjectVolumeStore      = require('stores/ProjectVolumeStore');
    stores.ProviderStore           = require('stores/ProviderStore');
    stores.ProviderMachineStore    = require('stores/ProviderMachineStore');
    stores.QuotaRequestStore       = require('stores/QuotaRequestStore');
    stores.QuotaStatusStore        = require('stores/QuotaStatusStore')
    stores.QuotaStore              = require('stores/QuotaStore');
    stores.SizeStore               = require('stores/SizeStore');
    stores.TagStore                = require('stores/TagStore');
    stores.UserStore                = require('stores/UserStore');
    stores.VersionStore            = require('stores/VersionStore');
    stores.VolumeStore             = require('stores/VolumeStore');

    var actions = require('actions');
    actions.ApplicationActions     = require('actions/ApplicationActions');
    actions.HelpActions            = require('actions/HelpActions');
    actions.ImageBookmarkActions   = require('actions/ImageBookmarkActions');
    actions.InstanceActions        = require('actions/InstanceActions');
    actions.InstanceTagActions     = require('actions/InstanceTagActions');
    actions.InstanceVolumeActions  = require('actions/InstanceVolumeActions');
    actions.NullProjectActions     = require('actions/NullProjectActions');
    actions.ProfileActions         = require('actions/ProfileActions');
    actions.ProjectActions         = require('actions/ProjectActions');
    actions.ProviderMachineActions = require('actions/ProviderMachineActions');
    actions.ProjectInstanceActions = require('actions/ProjectInstanceActions');
    actions.ProjectVolumeActions   = require('actions/ProjectVolumeActions');
    actions.TagActions             = require('actions/TagActions');
    //actions.UserActions             = require('actions/UserActions');
    actions.VersionActions         = require('actions/VersionActions');
    actions.VolumeActions          = require('actions/VolumeActions');

    return {
      run: function () {

        $.ajaxSetup({
          headers: {
            "Authorization": "Token " + window.access_token,
            "Content-Type": "application/json"
          }
        });

        $(document).ready(function () {
          var SplashScreenComponent = React.createFactory(SplashScreen);
          React.render(SplashScreenComponent(), document.getElementById('application'));
        });
      }
    }

  });
