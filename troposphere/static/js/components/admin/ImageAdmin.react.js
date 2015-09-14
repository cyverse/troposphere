define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      actions = require('actions'),
      ResourceActions = require('actions/ResourceActions');

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var requestId = (this.getParams().imageRequestId);
      
      var request = stores.ImageRequestStore.get(requestId);
      if(!request){
        return <div className="loading"></div>
      }

      // This is done to ensure boolean values are displayed as strings

      var allowImaging = "false";
      var forked = "false";
      
      if(request.get('new_version_forked')){
        forked = "true";
      }

      if(request.get('new_version_allow_imaging')){
        allowImaging = "true";
      }

      var instance = request.get('instance');

      return(
        <div className="quota-detail">
          <h2>Image Request #{request.get('id')}</h2>
          <div>Installed software: {request.get('installed_software')}</div>
          <div>Instance:</div>
          <ul>
            <li>ID: {instance.id}</li>
            <li>Name: {instance.name}</li>
          </ul>
          <div>iPlant sys files: {request.get('iplant_sys_files')}</div>
          <div>New application description: {request.get('new_application_description')}</div>
          <div>New application name: {request.get('new_application_name')}</div>
          <div>New machine owner: {request.get('new_machine_owner').username}</div>
          <div>New provider: {request.get('new_machine_provider').name}</div>
          <div>Allow imaging: {allowImaging}</div>
          <div>Forked: {forked}</div>
          <div>New version licenses: {request.get('new_version_licenses')}</div>
          <div>New version memory min: {request.get('new_version_memory_min')}</div>
          <div>New version storage min: {request.get('new_version_storage_min')}</div>
          <div>New version name: {request.get('new_version_name')}</div>
          <div>New version scripts: {request.get('new_version_scripts')}</div>
          <div>New version tags: {request.get('new_version_tags')}</div>
          <div>Status: {request.get('status')}</div>
        </div>
      );
    }
  });
}); 

