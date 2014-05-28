/** @jsx React.DOM */

define(
  [
    'react',
    './detail/InstanceDetails.react',
    'rsvp',
    'models/instance',
    'controllers/providers',
    'controllers/notifications'
  ],
  function (React, InstanceDetails, RSVP, Instance, ProviderController, NotificationController) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        providerId: React.PropTypes.string.isRequired,
        identityId: React.PropTypes.string.isRequired,
        instanceId: React.PropTypes.string.isRequired
      },

      getInitialState: function(){
        return {};
      },

      componentDidMount: function () {
        var providerId = this.props.providerId;
        var identityId = this.props.identityId;
        var instanceId = this.props.instanceId;

        RSVP.hash({
          instance: this.fetchInstance(providerId, identityId, instanceId),
          providers: this.fetchProviders()
        })
        .then(function (results) {
          this.setState({
            instance: results.instance,
            providers: results.providers
          });
        }.bind(this));
      },

      //
      // Fetching methods
      // ----------------
      //

      fetchInstance: function (providerId, identityId, instanceId) {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var instance = new Instance({
            identity: {
              provider: providerId,
              id: identityId
            },
            id: instanceId
          });

          instance.fetch({
            success: function (attrs) {
              resolve(instance);
            },
            error: function () {
              NotificationController.danger("Unknown Instance", "The requested instance does not exist.");
            }
          });
        });
        return promise;
      },

      fetchProviders: function () {
        return ProviderController.getProviders();
      },


      //
      // Render
      // ------
      //

      render: function () {
        if (this.state.instance && this.state.providers) {
          var providerId = this.state.instance.get('identity').provider;
          var provider = this.state.providers.get(providerId);

          return (
            <InstanceDetails instance={this.state.instance}
                             provider={provider}
            />
          );
        } else {
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
