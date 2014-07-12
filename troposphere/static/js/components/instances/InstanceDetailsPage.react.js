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
    'stores/IdentityStore',
    'stores/SizeStore'
  ],
  function (React, InstanceDetailsView, RSVP, Instance, ProviderStore, ProviderActions, NotificationController, InstanceStore, IdentityStore, SizeStore) {

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
        ProviderStore.addChangeListener(this.updateState);
        InstanceStore.addChangeListener(this.updateState);

        // todo: IdentityStore is only included here because InstanceStore.get(instanceId) is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        InstanceStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
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

          var identityId = this.state.instance.get('identity').id;
          var sizeId = this.state.instance.get('size_alias');
          var sizes = SizeStore.getAllFor(providerId, identityId);
          if(sizes) {
            var size = sizes.get(sizeId);

            return (
              <InstanceDetailsView instance={this.state.instance}
                                   provider={provider}
                                   size={size}
              />
            );
          }
        }

        return (
          <div className='loading'></div>
        );
      }

    });

  });
