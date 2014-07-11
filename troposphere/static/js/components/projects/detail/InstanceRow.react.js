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
        var instance = this.props.instance;
        return (
          <tr>
            <td><div className="resource-checkbox"></div></td>
            <td><a href="#">{instance.get('name')}</a></td>
            <td>{instance.get('status')}</td>
            <td>{instance.get('ip_address')}</td>
            <td>?tiny1?</td>
            <td><a href="#">?iPlant Cloud - Tucson?</a></td>
          </tr>
        );
      }

    });

  });
