define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      moment = require('moment'),
      Router = require('react-router');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var application = this.props.application,
          startDate = moment(application.get('start_date')),
          user = application.get('created_by');

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
                <Router.Link to="image-details" params={{imageId: application.id}}>
                  {application.get('name')}
                </Router.Link>
              </div>
            </div>
          </div>
        </li>
      );
    }

  });

});
