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
      stores.StatusStore.getAll();
      return{
        displayAdmin: false,
        response: ""
      }
    },

    handleDisplayChange: function (event){
      this.setState({displayAdmin: !this.state.displayAdmin});
    },

    handleResponseChange: function (event) {
      var response = event.target.value;
      if (response) this.setState({response: response});
    },

    approve: function(){

      var request = this.props.request,
      status = stores.StatusStore.findOne({name: "approved"});

      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

    deny: function(){

      var request = this.props.request,
      status = stores.StatusStore.findOne({name: "rejected"});

      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

    resubmit: function(){

      var request = this.props.request,
      status = stores.StatusStore.findOne({name: "pending"});
      
      ImageRequestActions.update({
        request: request,
        response: this.state.response,
        status: status.id
      });

    },

    renderAdminDetails: function(){
      var request = this.props.request,
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
        <div className="row admin-detail">
          <div className="pull-left col-md-3">
            <div>Request ID: {request.get('id')}</div>
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
          </div>

          <div className="pull-left col-md-3">
            <div>New version licenses: {request.get('new_version_licenses')}</div>
            <div>New version memory min: {request.get('new_version_memory_min')}</div>
            <div>New version cpu min: {request.get('new_version_cpu_min')}</div>
            <div>New version name: {request.get('new_version_name')}</div>
            <div>New version scripts: {request.get('new_version_scripts')}</div>
            <div>New version tags: {request.get('new_version_tags')}</div>
            <div>Request state: {request.get('old_status')}</div>
            <div>Status: {request.get('status').name}</div>
          </div>

          <div className="pull-right col-md-6">
            <textarea type="text" form="admin" value={this.state.value} cols="60" rows="8"
              onChange={this.handleResponseChange}/>
            <button onClick={this.approve} type="button" className="btn btn-default btn-sm">Approve</button>
            <button onClick={this.deny} type="button" className="btn btn-default btn-sm">Deny</button>
            <button onClick={this.resubmit} type="button" className="btn btn-default btn-sm">Re-Submit</button>
          </div>
        </div>
      );
    },

    render: function () {
      var request = this.props.request,
          adminDisplay;

      if(this.state.displayAdmin){
        adminDisplay = this.renderAdminDetails();
      }

      return(
        <li className="request clearfix">
          <a onClick={this.handleDisplayChange}>
            <div>{request.get('new_machine_owner').username}</div>
            <div>{request.get('instance').name}</div>
            <div>{request.get('status').name}</div>
          </a>
          {adminDisplay}
        </li>
      );
    }
  });
}); 

