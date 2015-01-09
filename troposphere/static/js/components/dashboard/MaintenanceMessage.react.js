/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'moment'
  ],
  function (React, Backbone, moment) {

    return React.createClass({

      propTypes: {
        message: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var message = this.props.message;

        return (
          <li>
            <div className="message activity-message sticky">
              <div>
                <i className="glyphicon glyphicon-wrench"></i>
              </div>
              <div className="details">
                <div>
                  <strong>{message.get('title')}</strong>
                </div>
                <div dangerouslySetInnerHTML={{__html: message.get('message')}}/>
              </div>
            </div>
          </li>
        );
      }

    });

  });
