/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'url'
  ],
  function (React, Backbone, URL) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var volume = this.props.volume;
        var volumeUrl = URL.projectVolume({
          project: this.props.project,
          volume: volume
        }, {absolute: true});
        return (
          <tr>
            <td><div className="resource-checkbox"></div></td>
            <td><a href={volumeUrl}>{volume.get('name')}</a></td>
            <td>Attached to <a href="#">?iPlant Base Instance?</a></td>
            <td>{volume.get('size') + " GB"}</td>
            <td><a href="#">?iPlant Cloud - Tucson?</a></td>
          </tr>
        );
      }

    });

  });
