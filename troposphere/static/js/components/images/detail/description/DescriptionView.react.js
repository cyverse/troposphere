
define(
  [
    'react',
    'backbone',
    'showdown'
  ],
  function (React, Backbone, Showdown) {

    return React.createClass({
      displayName: "DescriptionView",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var image = this.props.image,
          converter = new Showdown.Converter(),
          description = image.get('description'),
          descriptionHtml = converter.makeHtml(description);

        return (
          <div className="image-info-segment row">
            <h4 className="t-title col-md-2">Description:</h4>
            <div className="content col-md-10" dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
          </div>
        );
      }

    });

  });
