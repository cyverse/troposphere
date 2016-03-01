import React from 'react';
import Router from 'react-router';

export default React.createClass({
    displayName: "CallToAction",

    propTypes: {
      title: React.PropTypes.string.isRequired,
      image: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      linksTo: React.PropTypes.string.isRequired
    },

    render: function () {
      return (
        <Router.Link to={this.props.linksTo} className="option">
          <img src={this.props.image}/>
          <br/>
          <strong>{this.props.title}</strong>
          <hr/>
          {this.props.description}
        </Router.Link>
      );
    }
});
