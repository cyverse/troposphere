/** @jsx React.DOM */

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
          <li>
            <span className="name">{image.get('name')}</span>
            <span className="description">{image.get('description')}</span>
          </li>
        );
      }

    });

  });
