define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      actions = require('actions'),
      ImageRequestActions = require('actions/ImageRequestActions');

  return React.createClass({

    mixins: [Router.State],

    getInitialState: function(){
      return{
        response: ""
      }
    },

    handleResponseChange: function (event) {
      var response = event.target.value;
      if (response) this.setState({response: response});
    },

    approve: function(){

      // request is guaranteed to exist in our store, since we needed it to render this component
      var request = stores.ImageRequestStore.get(this.getParams().imageRequestId),
      status = stores.StatusStore.findOne({name: "approved"});

      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

    deny: function(){

      var request = stores.ImageRequestStore.get(this.getParams().imageRequestId),
      status = stores.StatusStore.findOne({name: "rejected"});

      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

    resubmit: function(){

      var request = stores.ImageRequestStore.get(this.getParams().imageRequestId),
      status = stores.StatusStore.findOne({name: "pending"});
      
      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

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
        <div className="admin-detail">
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
          <div>Request state: {request.get('old_status')}</div>
          <div>Status: {request.get('status').name}</div>
          <textarea type="text" form="admin" value={this.state.value} cols="60" rows="8"
                      onChange={this.handleResponseChange}/>
          <button onClick={this.approve} type="button" className="btn btn-default btn-sm">Approve</button>
          <button onClick={this.deny} type="button" className="btn btn-default btn-sm">Deny</button>
          <button onClick={this.resubmit} type="button" className="btn btn-default btn-sm">Re-Submit</button>
        </div>
      );
    }
  });
}); 

