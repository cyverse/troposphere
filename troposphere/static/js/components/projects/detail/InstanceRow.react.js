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
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance;
        var instanceUrl = URL.instance(instance, {absolute: true});
        return (
          <tr>
            <td><div className="resource-checkbox"></div></td>
            <td><a href={instanceUrl}>{instance.get('name')}</a></td>
            <td>{instance.get('status')}</td>
            <td>{instance.get('ip_address')}</td>
            <td>?tiny1?</td>
            <td><a href="#">?iPlant Cloud - Tucson?</a></td>
          </tr>
        );
      }

    });

  });
