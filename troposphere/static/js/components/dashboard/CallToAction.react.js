define(function (require) {

  var React = require('react/addons'),
    Router = require('react-router');

  return React.createClass({
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

});
