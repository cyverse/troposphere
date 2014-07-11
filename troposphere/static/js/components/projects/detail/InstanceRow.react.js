/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <tr>
            <td><div className="resource-checkbox"></div></td>
            <td><a href="#">Instance 1</a></td>
            <td>Active</td>
            <td>128.196.25</td>
            <td>tiny1</td>
            <td><a href="#">iPlant Cloud - Tucson</a></td>
          </tr>
        );
      }

    });

  });
