/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'moment',
    'url'
  ],
  function (React, Backbone, moment, URL) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var application = this.props.application;
        var startDate = moment(application.get('start_date'));
        var user = application.get('created_by');
        var imageUrl = URL.application(application);

        return (
          <li>
            <div className="message activity-message">
              <div>
                <i className="glyphicon glyphicon-floppy-disk"></i>
              </div>
              <div className="details">
                <div><strong>{user.username}</strong> created an image</div>
                <div>{startDate.format("MMM DD, YYYY")}</div>
                <div>
                  <a href={imageUrl}>{application.get('name')}</a>
                </div>
              </div>
            </div>
          </li>
        );
      }

    });

  });
