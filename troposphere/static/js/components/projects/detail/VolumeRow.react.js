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
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var volume = this.props.volume;
        var volumeUrl = URL.volume(volume, {absolute: true});
        return (
          <tr>
            <td><div className="resource-checkbox"></div></td>
            <td><a href="#">{volume.get('name')}</a></td>
            <td>Attached to <a href="#">?iPlant Base Instance?</a></td>
            <td>?200 GB?</td>
            <td><a href="#">?iPlant Cloud - Tucson?</a></td>
          </tr>
        );
      }

    });

  });
