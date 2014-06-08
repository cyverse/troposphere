/** @jsx React.DOM */

define(
  [
    'react',
    './report/Report.react',
    'rsvp',
    'models/Instance',
    'controllers/NotificationController'
  ],
  function (React, ReportImageView, RSVP, Instance, NotificationController) {

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
          instance: this.fetchInstance(providerId, identityId, instanceId)
        })
        .then(function (results) {
          this.setState({
            instance: results.instance
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

      //
      // Render
      // ------
      //

      render: function () {
        if (this.state.instance) {
          return (
            <ReportImageView instance={this.state.instance} />
          );
        } else {
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
