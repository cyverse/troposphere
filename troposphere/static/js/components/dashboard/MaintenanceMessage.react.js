/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        message: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var message = this.props.message;

        return (
          <li className="sticky">
            <div className="title">
              <i className="glyphicon glyphicon-pushpin"></i>
              <span>{message.get('title')}</span>
            </div>
            <div className="message">
              {message.get('message')}
            </div>
          </li>
        );
      }

    });

  });
