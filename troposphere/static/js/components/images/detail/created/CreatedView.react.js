define(function (require) {

    var React = require('react'),
        Backbone = require('backbone'),
        globals = require('globals'),
        moment = require('moment'),
        momentTZ = require('moment-timezone');

    return React.createClass({

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
            <h4 className="title col-md-2">Created:</h4>
            <p className="content col-md-10">{startDate}</p>
          </div>
        );
      }

    });

  });
