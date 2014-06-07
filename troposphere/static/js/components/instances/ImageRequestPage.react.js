/** @jsx React.DOM */

define(
  [
    'react',
    './image_request/ImageRequestView.react',
    'rsvp',
    'models/instance',
    'controllers/providers',
    'controllers/notifications',
    'collections/TagCollection'
  ],
  function (React, ImageRequestView, RSVP, Instance, ProviderController, NotificationController, TagCollection) {

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
        return {};
      },

      componentDidMount: function () {
        var providerId = this.props.providerId;
        var identityId = this.props.identityId;
        var instanceId = this.props.instanceId;

        RSVP.hash({
          instance: this.fetchInstance(providerId, identityId, instanceId),
          providers: this.fetchProviders(),
          tags: this.fetchTags()
        })
        .then(function (results) {
          this.setState({
            instance: results.instance,
            providers: results.providers,
            tags: results.tags
          });
        }.bind(this));
      },

      //
      // Fetching methods
      // ----------------
      //

      fetchInstance: function (providerId, identityId, instanceId) {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var instance = new Instance({
            identity: {
              provider: providerId,
              id: identityId
            },
            id: instanceId
          });

          instance.fetch({
            success: function (attrs) {
              resolve(instance);
            },
            error: function () {
              NotificationController.danger("Unknown Instance", "The requested instance does not exist.");
            }
          });
        });
        return promise;
      },

      fetchProviders: function () {
        return ProviderController.getProviders();
      },

      fetchTags: function () {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var tags = new TagCollection();

          tags.fetch({
            success: function (attrs) {
              resolve(tags);
            },
            error: function () {
              NotificationController.danger("Uh oh!", "There was a problem fetching the list of image tags.");
              reject();
            }
          });
        });
        return promise;
      },


      //
      // Render
      // ------
      //

      render: function () {
        if (this.state.instance && this.state.providers && this.state.tags) {
          var providerId = this.state.instance.get('identity').provider;
          var provider = this.state.providers.get(providerId);

          return (
            <ImageRequestView instance={this.state.instance}
                              provider={provider}
                              tags={this.state.tags}
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
