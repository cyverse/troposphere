define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      moment = require('moment'),
      Time = require('components/common/Time.react'),
      Gravatar = require('components/common/Gravatar.react'),
      CryptoJS = require('crypto'),
      stores = require('stores'),
      actions = require('actions');

  return React.createClass({

    propTypes: {
      machine: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
    },

    handleEditMachineDetails: function(){
      this.showMachineEditModal(this.props.machine);
    },
    //Observation - Should this be in machineList to dictate AT MOST 1?
      showMachineEditModal: function (machine) {
        actions.ProviderMachineActions.edit(machine, this.props.application);
      },


    renderEditLink: function(){
      var profile = stores.ProfileStore.get(),
          image = this.props.application;

      if(profile.id && profile.get('username') === image.get('created_by').username){
        return (
          <div className="edit-link-row">
            <a className="edit-link" onClick={this.handleEditMachineDetails}>Edit Version</a>
          </div>
        )
      }
    },
    renderProvider: function(provider) {
      return (<li>{provider}</li>);
    },
    render: function () {
      return (
        <li>
          <h1>
            {
              "FIX ME PLEASE!! " +
              "Need to implement api/v2/provider_machines?application_version__application__id=902. " +
              "See ProviderMachineStore."
            }
          </h1>
        </li>
      );

      // todo: figure out if anything is ever recommended, or if it's just a concept idea
      var common_format = "M/DD/YYYY",
          machine = this.props.machine,
          image = this.props.application,
          isRecommended = false,
          version = machine.get('version'),
          isActive = version.end_date == null,
          dateCreated = moment(version.start_date),
          dateDestroyed = isActive ? null : moment(version.end_date), // Avoid 'invalid date'
          machineHash = CryptoJS.MD5(machine.id.toString()).toString(),
          iconSize = 63,
          type = stores.ProfileStore.get().get('icon_set');

      var createDate = dateCreated.format(common_format);
      var providers = image.get("machines").map(function(machine) {
         var provider =  machine.get("provider");
         return provider.name;
      });

      return (
        <li>
          <div>
            <div className="image-version-header col-md-2">
                <Gravatar hash={machineHash} size={iconSize} type={type}/>
                <span>{createDate}</span>
                {this.renderEditLink()}
            </div>
            <div className="image-version-details col-md-10">
              <div className="version">
                <h3>Available On</h3>
                <ul>
                {providers.map(this.renderProvider)}
                </ul>
                <h3>Description</h3>
                {version.description}
                {isRecommended ? <span className="recommended-tag">Recommended</span>
                               : null}
                {isActive ? <span className="recommended-tag">Active</span>
                          : <span>dateDestroyed.format(common_format)</span>}
              </div>
              <div>{machine.get('ownerid')}</div>
            </div>
          </div>
        </li>
      );
    }

  });

});
