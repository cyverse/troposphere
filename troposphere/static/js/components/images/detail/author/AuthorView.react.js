
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
<<<<<<< HEAD:troposphere/static/js/components/images/detail/author/AuthorView.react.js
            <h4 className="title col-md-2">Created by:</h4>
=======
            <h4 className="title col-md-2">Created by</h4>

>>>>>>> master:troposphere/static/js/components/applications/detail/author/AuthorView.react.js
            <p className="content col-md-10">{image.get('created_by').username}</p>
          </div>
        );
      }

    });

  });
