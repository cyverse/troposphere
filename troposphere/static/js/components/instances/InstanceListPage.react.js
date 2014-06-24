/** @jsx React.DOM */

define(
  [
    'react',
    './list/InstanceListView.react',
    'rsvp',
    'stores/InstanceStore',
    'stores/IdentityStore',
    'stores/ProviderStore'
  ],
  function (React, InstanceListView, RSVP, InstanceStore, IdentityStore, ProviderStore) {

    function getState(){
      return {
        instances: InstanceStore.getAll(),
        providers: ProviderStore.getAll()
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
        ProviderStore.addChangeListener(this.updateInstances);

        // todo: IdentityStore is only included here because InstanceStore.getAll() is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateInstances);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateInstances);
        ProviderStore.removeChangeListener(this.updateInstances);
        IdentityStore.removeChangeListener(this.updateInstances);
      },

      //
      // Render
      // ------
      //
      render: function () {
        if (this.state.instances && this.state.providers) {
          return (
            <InstanceListView instances={this.state.instances}
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
