define(function (require) {
    'use strict';

    var $ = require('jquery'),
        React = require('react'),
        SplashScreen = require('components/SplashScreen.react');

    // Register which stores the application should use
    var stores = require('stores');
    stores.ApplicationStore        = require('stores/ApplicationStore');
    stores.IdentityStore           = require('stores/IdentityStore');
    stores.InstanceHistoryStore    = require('stores/InstanceHistoryStore');
    stores.InstanceStore           = require('stores/InstanceStore');
    stores.InstanceTagStore        = require('stores/InstanceTagStore');
    stores.MachineStore            = require('stores/MachineStore');
    stores.MaintenanceMessageStore = require('stores/MaintenanceMessageStore');
    stores.ProfileStore            = require('stores/ProfileStore');
    stores.ProjectStore            = require('stores/ProjectStore');
    stores.ProjectInstanceStore    = require('stores/ProjectInstanceStore');
    stores.ProjectVolumeStore      = require('stores/ProjectVolumeStore');
    stores.ProviderStore           = require('stores/ProviderStore');
    stores.QuotaRequestStore       = require('stores/QuotaRequestStore');
    stores.SizeStore               = require('stores/SizeStore');
    stores.TagStore                = require('stores/TagStore');
    stores.VersionStore            = require('stores/VersionStore');
    stores.VolumeStore             = require('stores/VolumeStore');

    var actions = require('actions');
    actions.ApplicationActions     = require('actions/ApplicationActions');
    actions.HelpActions            = require('actions/HelpActions');
    actions.InstanceActions        = require('actions/InstanceActions');
    actions.InstanceTagActions     = require('actions/InstanceTagActions');
    actions.InstanceVolumeActions  = require('actions/InstanceVolumeActions');
    actions.NullProjectActions     = require('actions/NullProjectActions');
    actions.ProfileActions         = require('actions/ProfileActions');
    actions.ProjectActions         = require('actions/ProjectActions');
    actions.ProjectInstanceActions = require('actions/ProjectInstanceActions');
    actions.ProjectVolumeActions   = require('actions/ProjectVolumeActions');
    actions.TagActions             = require('actions/TagActions');
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
