/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        title: React.PropTypes.string.isRequired,
        image: React.PropTypes.string.isRequired,
        description: React.PropTypes.string.isRequired,
        link: React.PropTypes.string.isRequired
      },

      render: function () {
        return (
          <a href={this.props.link} className="option">
            <img src={this.props.image}/>
            <br/>
            <strong>{this.props.title}</strong>
            <hr/>
            {this.props.description}
          </a>
        );
      }

    });

  });
