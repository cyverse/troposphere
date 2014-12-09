/** @jsx React.DOM */

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
            converter = new Showdown.converter(),
            description = application.get('description'),
            descriptionHtml = converter.makeHtml(description);

        return (
          <div className='image-description'>
            <h2>Image Description</h2>
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
          </div>
        );
      }

    });

  });
