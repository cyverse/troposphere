define(function (require) {
  "use strict";

  var globals = require('globals'),
    stores = require('stores'),
    $ = require('jquery'),
    Utils = require('../Utils');

  return {

    requestImage: function(params){

      if(!params.instance) throw new Error("Missing instance");
      if(!params.name) throw new Error("Missing name");
      if(!params.description) throw new Error("Missing description");
      if(!params.tags) throw new Error("Missing tags");
      if(params.versionFork == undefined) throw new Error("Missing create/update flag(fork)");
      if(!params.versionName) throw new Error("Missing name");
      if(!params.versionChanges) throw new Error("Missing description");
      if(!params.providerId) throw new Error("Missing providerId");
      //if(!params.software) throw new Error("Missing software");
      //if(!params.filesToExclude) throw new Error("Missing filesToExclude");
      //if(!params.systemFiles) throw new Error("Missing systemFiles");
      if(!params.scripts) throw new Error("Missing scripts");
      if(!params.licenses) throw new Error("Missing licenses");
      if(!params.visibility) throw new Error("Missing visibility");
      if(!params.imageUsers) throw new Error("Missing imageUsers");

      // temp. workaround for getting user's identity
      var identity = stores.IdentityStore.getAll().models[0].id;

      var software = params.software || "[no files specified]",
          accessList = params.imageUsers.map(function(user){
            return user.get('username');
          }),
          excludeFiles = params.filesToExclude,
          description = params.description,
          providerId = params.providerId,
          instance = params.instance.get('id'),
          identity = identity,
          iplantSysFiles = params.systemFiles,
          filesToExclude = params.filesToExclude,
          newApplicationDescription = params.description,
          newApplicatonName = params.name,
          newApplicationVisibility = params.visibility,
          newMachineOwner = stores.ProfileStore.get().get('user'),
          newMachineProvider = params.providerId,
          newMachineAllowImaging = params.imaging,
          newVersionChangeLog = params.versionChanges,
          newVersionForked = params.versionFork,
          versionName = params.versionName,
          newVersionMemoryMin = '0',
          newVersionStorageMin = '0';


      var requestData = {
        access_list: accessList,
        exclude_files: filesToExclude || "[no files specified]",
        installed_software: software,
        instance: instance,
        identity: identity,
        iplant_sys_files: iplantSysFiles || "[no files specified]",
        new_application_description: description,
        new_application_name: name,
        new_application_visibility: newApplicationVisibility,
        new_machine_owner: newMachineOwner,
        new_machine_provider: providerId,
        new_version_allow_imaging: true,
        new_version_change_log: newVersionChangeLog,
        new_version_forked: newVersionForked,
        new_version_name: versionName,
        new_version_memory_min: newVersionMemoryMin,
        new_version_storage_min: newVersionStorageMin
      };

      var requestUrl = (
        globals.API_V2_ROOT + "/machine_requests"
      );

      $.ajax({
        url: requestUrl,
        type: 'POST',
        data: JSON.stringify(requestData),
        dataType: 'json',
        contentType: 'application/json',
        success: function (model) {
          Utils.displaySuccess({message: "Your image request has been sent to support."});
        },
        error: function (response, status, error) {
          Utils.displayError({title: "Your image request could not be sent", response: response});
        }
      });
    }

  };

});
