/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <tr>
            <td><div className="resource-checkbox"></div></td>
            <td><a href="#">Volume 1</a></td>
            <td>Attached to <a href="#">iPlant Base Instance</a></td>
            <td>200 GB</td>
            <td><a href="#">iPlant Cloud - Tucson</a></td>
          </tr>
        );
      }

    });

  });
