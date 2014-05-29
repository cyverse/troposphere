/** @jsx React.DOM */

define(
  [
    'react',
    './detail/InstanceDetails.react',
    'rsvp',
    'models/instance',
    'stores/providers',
    'actions/providers',
    'controllers/notifications'
  ],
  function (React, InstanceDetails, RSVP, Instance, ProviderStore,
  ProviderActions, NotificationController) {

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
        return {
          providers: ProviderStore.getAll()
        };
      },

      componentDidMount: function () {
        var providerId = this.props.providerId;
        var identityId = this.props.identityId;
        var instanceId = this.props.instanceId;

        RSVP.hash({
          instance: this.fetchInstance(providerId, identityId, instanceId),
        })
        .then(function (results) {
          this.setState({
            instance: results.instance,
          });
        }.bind(this));

        ProviderStore.addChangeListener(this.updateProviders);

        if (this.state.providers.isEmpty())
          ProviderActions.fetchAll();
      },

      componentDidUnmount: function () {
        ProviderStore.removeChangeListener(this.updateProviders);
      },

      updateProviders: function() {
        this.setState({providers: ProviderStore.getAll()});
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
