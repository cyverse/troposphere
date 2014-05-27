/** @jsx React.DOM */

define(
  [
    'react',
    'controllers/volumes'
  ],
  function (React, VolumeController) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var providerId = this.props.volume.get('identity').provider;
        var provider = this.props.providers.get(providerId);
        VolumeController.detach(this.props.volume, provider);
      },

      render: function () {
        var detaching = this.props.volume.get('status') === 'detaching';

        var className = 'btn btn-primary';
        var disabled;
        if (detaching) {
          className += ' disabled';
          disabled = true;
        }

        return (
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='attached_instance'/>
            <button className={className} disabled={disabled}>
              {detaching ? "Detaching..." : "Detach"}
            </button>
          </form>
        );
      }

    });

  });
