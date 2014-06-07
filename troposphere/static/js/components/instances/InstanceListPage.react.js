/** @jsx React.DOM */

define(
  [
    'react',
    './list/InstanceListView.react',
    'rsvp',
    'stores/InstanceStore',
    'stores/IdentityStore'
  ],
  function (React, InstanceListView, RSVP, InstanceStore, IdentityStore) {

    function getState(){
      return {
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

      updateInstances: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        InstanceStore.addChangeListener(this.updateInstances);

        // todo: IdentityStore is only included here because InstanceStore.getAll() is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateInstances);
      },

      componentDidUnmount: function () {
        InstanceStore.removeChangeListener(this.updateInstances);
        IdentityStore.removeChangeListener(this.updateInstances);
      },

      //
      // Render
      // ------
      //
      render: function () {
        if (this.state.instances) {
          return (
            <InstanceListView instances={this.state.instances} />
          );
        } else {
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
