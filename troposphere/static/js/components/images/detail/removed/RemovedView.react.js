import React from 'react';
import Backbone from 'backbone';
import globals from 'globals';
import moment from 'moment';
// implicit include within context for `.tz()`
import momentTZ from 'moment-timezone';

export default React.createClass({
    displayName: "RemovedView",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var image = this.props.image,
          endDate = moment(image.get('end_date'));
      if (endDate.isValid()) {
          let formatDate = endDate.tz(globals.TZ_REGION).format("M/DD/YYYY hh:mm a z");
          endDate = formatDate;
      } else {
          // Hide this from view when end date isn't available
          // Based on API permissions, this means only STAFF
          // and ImageOwners will see this view.
          return (
              <div className="hidden">
              </div>);
      }

      return (
        <div className="image-info-segment row">
          <h4 className="t-title col-md-2">Removed from Image List</h4>

          <p className="content col-md-10">{endDate}</p>
        </div>
      );
    }
});
