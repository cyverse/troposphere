/** @jsx React.DOM */

define(
  [
    'react',
    './list/VolumeListView.react',
    'rsvp',
    'stores/VolumeStore',
    'stores/IdentityStore'
  ],
  function (React, VolumeListView, RSVP, VolumeStore, IdentityStore) {

    function getState(){
      return {
        volumes: VolumeStore.getAll()
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

      updateInstances: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        VolumeStore.addChangeListener(this.updateInstances);

        // todo: IdentityStore is only included here because InstanceStore.getAll() is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateInstances);
      },

      componentDidUnmount: function () {
        VolumeStore.removeChangeListener(this.updateInstances);
        IdentityStore.removeChangeListener(this.updateInstances);
      },

      //
      // Render
      // ------
      //
      render: function () {
        if (this.state.volumes) {
          return (
            <VolumeListView volumes={this.state.volumes} />
          );
        } else {
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
