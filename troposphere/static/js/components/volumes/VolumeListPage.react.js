/** @jsx React.DOM */

define(
  [
    'react',
    './list/VolumeListView.react',
    'rsvp',
    'collections/identities',
    'collections/volumes'
  ],
  function (React, VolumeListView, RSVP, Identities, Volumes) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        // none
      },

      getInitialState: function(){
        return {};
      },

      componentDidMount: function () {
        var self = this;
        RSVP.hash({
          identities: self.fetchIdentities()
        })
        .then(function (results) {
          // return an array of promises (one for each volume collection being fetched)
          var promises = results.identities.map(function (identity) {
            var providerId = identity.get('provider_id');
            var identityId = identity.get('id');
            return self.fetchVolumesFor(providerId, identityId);
          });
          return RSVP.all(promises);
        })
        .then(function (volumeCollections) {
          // Combine all results into a single volume collection
          var volumes = new Volumes();
          for(var i = 0; i < volumeCollections.length; i++) {
            volumes.add(volumeCollections[i].toJSON());
          };
          self.setState({
            volumes: volumes
          })
        });
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

      fetchVolumesFor: function (providerId, identityId) {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var volumes = new Volumes(null, {
            provider_id: providerId,
            identity_id: identityId
          });
          // make sure promise returns the right volumes collection
          // for when this function is called multiple times
          (function(volumes, resolve){
            volumes.fetch().done(function(){
              resolve(volumes);
            });
          })(volumes, resolve)

        });
        return promise;
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
