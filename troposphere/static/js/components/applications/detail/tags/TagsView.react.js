/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Tags.react'
  ],
  function (React, Backbone, Tags) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div className="image-tags">
            <h2 className='tag-title'>Image Tags</h2>
            <a href='#'>Suggest a Tag</a>
            <Tags tags={this.props.application.get('tags')}/>
          </div>
        );
      }

    });

  });
