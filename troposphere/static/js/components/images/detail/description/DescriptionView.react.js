
define(
  [
    'react',
    'backbone',
    'showdown'
  ],
  function (React, Backbone, Showdown) {

    return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
<<<<<<< HEAD:troposphere/static/js/components/images/detail/description/DescriptionView.react.js
        var image = this.props.image,
            converter = new Showdown.converter(),
            description = image.get('description'),
            descriptionHtml = converter.makeHtml(description);

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Description:</h4>
=======
        var application = this.props.application,
          converter = new Showdown.Converter(),
          description = application.get('description'),
          descriptionHtml = converter.makeHtml(description);

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Description</h4>

>>>>>>> master:troposphere/static/js/components/applications/detail/description/DescriptionView.react.js
            <div className="content col-md-10" dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
          </div>
        );
      }

    });

  });
