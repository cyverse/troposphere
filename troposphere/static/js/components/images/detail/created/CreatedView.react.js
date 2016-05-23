import React from 'react';
import Backbone from 'backbone';
import globals from 'globals';
import moment from 'moment';
import momentTZ from 'moment-timezone';

export default React.createClass({
      displayName: "CreatedView",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var image = this.props.image,
          startDate = moment(image.get('start_date'))
                        .tz(globals.TZ_REGION)
                        .format("M/DD/YYYY hh:mm a z");

        return (
          <div className="image-info-segment row">
            <h4 className="t-title col-md-2">Created:</h4>
            <p className="content col-md-10">{startDate}</p>
          </div>
        );
      }
});
