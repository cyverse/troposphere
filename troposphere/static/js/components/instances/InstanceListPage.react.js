/** @jsx React.DOM */

define(
  [
    'react',
    './list/InstanceListView.react',
    'rsvp',
    'collections/identities',
    'collections/instances',
    'stores/InstanceStore'
  ],
  function (React, InstanceListView, RSVP, Identities, Instances, InstanceStore) {

    function getState(){
      return { }
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
        //InstanceStore.addChangeListener(this.updateInstances);

        var self = this;
        RSVP.hash({
          identities: self.fetchIdentities()
        })
        .then(function (results) {
          // return an array of promises (one for each volume collection being fetched)
          var promises = results.identities.map(function (identity) {
            var providerId = identity.get('provider_id');
            var identityId = identity.get('id');
            return self.fetchInstancesFor(providerId, identityId);
          });
          return RSVP.all(promises);
        })
        .then(function (instanceCollections) {
          // Combine all results into a single volume collection
          var instances = new Instances();
          for(var i = 0; i < instanceCollections.length; i++) {
            instances.add(instanceCollections[i].toJSON());
          };
          self.setState({
            instances: instances
          })
        });
      },

      componentDidUnmount: function () {
        //InstanceStore.removeChangeListener(this.updateInstances);
      },

      //
      // Fetching methods
      // ----------------
      //

      fetchIdentities: function () {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var identities = new Identities();
          identities.fetch().done(function(){
            resolve(identities);
          });
        });
        return promise;
      },

      fetchInstancesFor: function (providerId, identityId) {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var instances = new Instances(null, {
            provider_id: providerId,
            identity_id: identityId
          });
          // make sure promise returns the right instances collection
          // for when this function is called multiple times
          (function(instances, resolve){
            instances.fetch().done(function(){
              resolve(instances);
            });
          })(instances, resolve)

        });
        return promise;
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
