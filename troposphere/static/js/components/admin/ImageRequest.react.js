import React from 'react';
import Router from 'react-router';
import stores from 'stores';
import actions from 'actions';
import ImageRequestActions from 'actions/ImageRequestActions';

export default React.createClass({
    displayName: "ImageRequest",

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

      var request = stores.ImageRequestStore.get(this.getParams().id),
      status = stores.StatusStore.findOne({name: "approved"});

      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

    deny: function(){

      var request = stores.ImageRequestStore.get(this.getParams().id),
      status = stores.StatusStore.findOne({name: "rejected"});

      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

    resubmit: function(){

      var request = stores.ImageRequestStore.get(this.getParams().id),
      status = stores.StatusStore.findOne({name: "pending"});

      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

    render: function () {
      var request = stores.ImageRequestStore.get(this.getParams().id),
          instance = request.get('instance');

      // ensure boolean values are displayed as strings
      var allowImaging = "false";
      var forked = "false";

      if(request.get('new_version_forked')){
        forked = "true";
      }

      if(request.get('new_version_allow_imaging')){
        allowImaging = "true";
      }

      return(
        <div className="request-admin pull-right admin-detail">
          <div>
            <div>Request ID: {request.get('id')}</div>
            <div>Installed software: {request.get('installed_software')}</div>
            <div>Instance ID: {instance.id}</div>
            <div>Instance name: {instance.name}</div>
            <div>iPlant sys files: {request.get('iplant_sys_files')}</div>
            <div>New application description: {request.get('new_application_description')}</div>
            <div>New application name: {request.get('new_application_name')}</div>
            <div>New machine owner: {request.get('new_machine_owner').username}</div>
            <div>New provider: {request.get('new_machine_provider').name}</div>
            <div>Allow imaging: {allowImaging}</div>
            <div>Forked: {forked}</div>
          </div>

          <div>
            <div>New version licenses: {request.get('new_version_licenses')}</div>
            <div>New version memory min: {request.get('new_version_memory_min')}</div>
            <div>New version cpu min: {request.get('new_version_cpu_min')}</div>
            <div>New version name: {request.get('new_version_name')}</div>
            <div>New version scripts: {request.get('new_version_scripts')}</div>
            <div>New version tags: {request.get('new_version_tags')}</div>
            <div>Request state: {request.get('old_status')}</div>
            <div>Status: {request.get('status').name}</div>
          </div>

          <div className="request-actions">
            <h4>Response:</h4><br />
            <textarea type="text" form="admin" value={this.state.value}
              onChange={this.handleResponseChange}/><br />
            <button disabled={request.get('status').name != 'pending'}onClick={this.approve} type="button" className="btn btn-default btn-sm">Approve</button>
            <button disabled={request.get('status').name != 'pending'}onClick={this.deny} type="button" className="btn btn-default btn-sm">Deny</button>
            <button disabled={request.get('status').name == 'closed'}onClick={this.resubmit} type="button" className="btn btn-default btn-sm">Re-Submit</button>
          </div>
        </div>
      );
    }
});
