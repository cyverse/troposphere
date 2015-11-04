
define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({
      displayName: "VolumeNotRealRow",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <tr className="not-real-resource-row">
            <td></td>
            <td>
              <span>{this.props.volume.get('name')}</span>
            </td>
            <td>
              NOT REAL VOLUME
            </td>
            <td></td>
            <td></td>
          </tr>
        );
      }

    });

  });
