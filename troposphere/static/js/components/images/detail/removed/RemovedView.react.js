define(function (require) {
  var React = require('react'),
    Backbone = require('backbone'),
    globals = require('globals'),
    moment = require('moment'),
    // implicit include within context for `.tz()`
    momentTZ = require('moment-timezone');

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var image = this.props.image,
          endDate = moment(image.get('end_date'));
      if (endDate.isValid()) {
          formatDate = endDate.tz(globals.TZ_REGION).format("M/DD/YYYY hh:mm a z");
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
          <h4 className="title col-md-2">Removed from Image List</h4>

          <p className="content col-md-10">{endDate}</p>
        </div>
      );
    }

  });

});
