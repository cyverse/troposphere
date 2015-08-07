define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    moment = require('moment'),
    Router = require('react-router');

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var image = this.props.image,
        startDate = moment(image.get('start_date')),
        user = image.get('created_by');

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
                <Router.Link to="image-details" params={{imageId: image.id}}>
                  {image.get('name')}
                </Router.Link>
              </div>
            </div>
          </div>
        </li>
      );
    }

  });

});
