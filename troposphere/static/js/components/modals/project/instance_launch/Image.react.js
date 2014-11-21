/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onClick: React.PropTypes.func
      },

      handleClick: function(){
        if(this.props.onClick) this.props.onClick(this.props.image);
      },

      render: function () {
        var image = this.props.image;

        return (
          <li onClick={this.handleClick}>
            <span className="name">{image.get('name')}</span>
            <span className="description">{image.get('description')}</span>
          </li>
        );
      }

    });

  });
