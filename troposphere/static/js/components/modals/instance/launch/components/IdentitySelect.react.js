/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/modal',
    'stores'
  ],
  function (React, Backbone, ModalMixin, stores) {

    return React.createClass({

      propTypes: {
        identityId: React.PropTypes.number.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      getOptions: function () {
        var identityOptions = this.props.identities.map(function(identity){
          var providerId = identity.get('provider').id;
          var provider = this.props.providers.get(providerId);
          var provider_name = provider.get('name');
          var isInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(providerId);
          if(isInMaintenance) provider_name += " (disabled - in maintenance)";
          if(this.props.identityId == identity.id) {
            return (
              <option key={identity.id} value={identity.id} selected disabled={isInMaintenance}>
                {provider_name}
              </option>
            );
          } else {
            return (
              <option key={identity.id} value={identity.id} disabled={isInMaintenance}>
                {provider_name}
              </option>
            );
          }
        }.bind(this));

        return identityOptions;
      },

      render: function () {
        var options = this.getOptions();
        return (
          <select value={this.props.identityId} id='identity' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>
        );
      }
    });

  });
