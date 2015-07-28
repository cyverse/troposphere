
define(
  [
    'react',
    'backbone',
    'showdown'
  ],
  function (React, Backbone, Showdown) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var application = this.props.application,
          converter = new Showdown.Converter(),
          description = application.get('description'),
          descriptionHtml = converter.makeHtml(description);

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Description</h4>

            <div className="content col-md-10" dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
          </div>
        );
      }

    });

  });
