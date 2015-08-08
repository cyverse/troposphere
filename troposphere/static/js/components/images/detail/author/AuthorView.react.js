
define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var image = this.props.image;

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Created by:</h4>
            <p className="content col-md-10">{image.get('created_by').username}</p>
          </div>
        );
      }

    });

  });
