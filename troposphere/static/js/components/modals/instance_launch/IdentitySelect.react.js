/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/modal'
  ],
  function (React, Backbone, ModalMixin) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      getOptions: function () {
        var identityOptions = this.props.identities.map(function(identity){
          var providerId = identity.get('provider_id');
          var provider = this.props.providers.get(providerId);
          var provider_name = provider.get('name');

          return (
            <option value={identity.id}>
              {"Identity " + identity.id + " on " + provider_name}
            </option>
          );
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
