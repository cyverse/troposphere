/** @jsx React.DOM */

define(
  [
    'react',
    './list/VolumeListView.react',
    'rsvp',
    'stores/VolumeStore',
    'stores/InstanceStore',
    'stores/IdentityStore'
  ],
  function (React, VolumeListView, RSVP, VolumeStore, InstanceStore, IdentityStore) {

    function getState(){
      return {
        volumes: VolumeStore.getAll(),
        instances: InstanceStore.getAll()
      }
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        // none
      },

      getInitialState: function(){
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        VolumeStore.addChangeListener(this.updateState);
        InstanceStore.addChangeListener(this.updateState);

        // todo: IdentityStore is only included here because InstanceStore.getAll() is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        VolumeStore.removeChangeListener(this.updateState);
        InstanceStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //
      render: function () {
        if (this.state.volumes && this.state.instances) {
          return (
            <VolumeListView volumes={this.state.volumes}
                            instances={this.state.instances}
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
