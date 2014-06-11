/** @jsx React.DOM */

define(
  [
    'react',
    './detail/InstanceDetailsView.react',
    'rsvp',
    'models/Instance',
    'stores/ProviderStore',
    'actions/ProviderActions',
    'controllers/NotificationController',
    'stores/InstanceStore',
    'stores/IdentityStore'
  ],
  function (React, InstanceDetailsView, RSVP, Instance, ProviderStore, ProviderActions, NotificationController, InstanceStore, IdentityStore) {

    function getState(instanceId){
      return {
        providers: ProviderStore.getAll(),
        instance: InstanceStore.get(instanceId)
      }
    }

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
        return getState(this.props.instanceId);
      },

      componentDidMount: function () {
//        var providerId = this.props.providerId;
//        var identityId = this.props.identityId;
//        var instanceId = this.props.instanceId;
//
//        RSVP.hash({
//          instance: this.fetchInstance(providerId, identityId, instanceId)
//        })
//        .then(function (results) {
//          this.setState({
//            instance: results.instance
//          });
//        }.bind(this));

        ProviderStore.addChangeListener(this.updateState);
        InstanceStore.addChangeListener(this.updateState);

        // todo: IdentityStore is only included here because InstanceStore.get(instanceId) is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateState);
      },

      componentDidUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        InstanceStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
      },

      updateState: function() {
        if (this.isMounted()) this.setState(getState(this.props.instanceId));
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
            <InstanceDetailsView instance={this.state.instance}
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
