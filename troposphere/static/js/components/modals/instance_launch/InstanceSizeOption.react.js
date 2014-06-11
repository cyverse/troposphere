/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        size: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      canLaunch: function (size) {
        return size.get('remaining') > 0;
      },

      render: function () {
        return (
          <option value={this.props.size.id}>
            {this.props.size.formattedDetails()}
          </option>
        );
      }
    });

  });
