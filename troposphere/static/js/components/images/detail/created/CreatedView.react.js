
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
<<<<<<< HEAD:troposphere/static/js/components/images/detail/created/CreatedView.react.js
        var image = this.props.image,
            startDate = moment(image.get('start_date')).format("MMM D, YYYY");

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Created:</h4>
=======
        var image = this.props.application,
          startDate = moment(image.get('start_date')).format("MMM D, YYYY");

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Created</h4>

>>>>>>> master:troposphere/static/js/components/applications/detail/created/CreatedView.react.js
            <p className="content col-md-10">{startDate}</p>
          </div>
        );
      }

    });

  });
