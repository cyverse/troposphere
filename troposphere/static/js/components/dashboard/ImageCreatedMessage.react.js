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
        var username = application.get('created_by');
        var imageUrl = URL.application(application);

        return (
          <li>
            <div className="title">
              <i className="glyphicon glyphicon-floppy-disk"></i>
              <span><strong>{username}</strong> created the image <a href={imageUrl}>{application.get('name')}</a> on {startDate.format("M/D/YY")}</span>
            </div>
          </li>
        );
      }

    });

  });
