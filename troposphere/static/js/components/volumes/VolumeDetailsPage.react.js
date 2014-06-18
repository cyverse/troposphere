/** @jsx React.DOM */

define(
  [
    'react',
    'stores/VolumeStore',
    'stores/ProviderStore',
    'stores/IdentityStore',
    './details/VolumeDetailsView.react'
  ],
  function (React, VolumeStore, ProviderStore, IdentityStore, VolumeDetailsView) {

    function getState(props){
      return {
        volume: VolumeStore.get(props.volumeId),
        providers: ProviderStore.getAll()
      };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        providerId: React.PropTypes.string.isRequired,
        identityId: React.PropTypes.string.isRequired,
        volumeId: React.PropTypes.string.isRequired
      },

      getInitialState: function(){
        return getState(this.props);
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState(this.props));
      },

      componentDidMount: function () {
        VolumeStore.addChangeListener(this.updateState);
        ProviderStore.addChangeListener(this.updateState);

        // todo: IdentityStore is only included here because InstanceStore.getAll() is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        VolumeStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //
      render: function () {
        if (this.state.volume && this.state.providers) {
          return (
            <VolumeDetailsView volume={this.state.volume}
                               providers={this.state.providers}
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
