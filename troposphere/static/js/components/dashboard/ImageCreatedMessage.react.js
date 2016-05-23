import React from 'react';
import Backbone from 'backbone';
import moment from 'moment';
import Router from 'react-router';

export default React.createClass({
    displayName: "ImageCreatedMessage",

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
              <div>{startDate.format("MMM DD, YYYY hh:mm a")}</div>
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
