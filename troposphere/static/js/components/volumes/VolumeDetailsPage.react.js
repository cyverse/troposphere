/** @jsx React.DOM */

define(
  [
    'react',
    './details/VolumeDetail.react',
    'rsvp',
    'models/volume',
    'controllers/providers',
    'components/volumes/VolumeDetailsPage.react',
    'controllers/notifications',
    'collections/instances'
  ],
  function (React, VolumeDetail, RSVP, Volume, ProviderController, VolumeDetailsPage, NotificationController, Instances) {

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
        return {};
      },

      componentDidMount: function () {
        var providerId = this.props.providerId;
        var identityId = this.props.identityId;
        var volumeId = this.props.volumeId;

        RSVP.hash({
          volume: this.fetchVolume(providerId, identityId, volumeId),
          providers: this.fetchProviders(),
          instances: this.fetchInstances(providerId, identityId)
        })
        .then(function (results) {
          this.setState({
            volume: results.volume,
            providers: results.providers,
            instances: results.instances
          })
        }.bind(this));
      },

      //
      // Fetching methods
      // ----------------
      //
      fetchVolume: function (providerId, identityId, volumeId) {
        var promise = new RSVP.Promise(function (resolve, reject) {

          var volume = new Volume({
            identity: {
              provider: providerId,
              id: identityId
            },
            id: volumeId
          });

          volume.fetch({
            success: function (volumeAttributes) {
              resolve(volume);
            },
            error: function () {
              NotificationController.danger("Unknown Volume", "The requested volume does not exist.");
            }
          });

        });
        return promise;
      },

      fetchProviders: function () {
        return ProviderController.getProviders();
      },

      fetchInstances: function (providerId, identityId) {
        var promise = new RSVP.Promise(function (resolve, reject) {

          var instances = new Instances([], {
            provider_id: providerId,
            identity_id: identityId
          });

          instances.fetch().done(function(){
            resolve(instances);
          });

        });
        return promise;
      },

      //
      // Render
      // ------
      //
      render: function () {
        if (this.state.volume && this.state.providers && this.state.instances) {
          return (
            <VolumeDetail volume={this.state.volume}
                          providers={this.state.providers}
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
