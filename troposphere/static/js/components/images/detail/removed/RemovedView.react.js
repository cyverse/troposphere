
define(
  [
    'react',
    'backbone',
    'moment'
  ],
  function (React, Backbone, moment) {

    return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var image = this.props.image,
            endDate = moment(image.get('end_date'));
        if (endDate.isValid()) {
            endDate = endDate.format("MMM D, YYYY hh:mm a");
        } else {
            //Hide this from view when end date isn't available
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
