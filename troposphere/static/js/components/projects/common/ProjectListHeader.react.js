define(function (require) {

  var React = require('react/addons');

  return React.createClass({

    propTypes: {
      title: React.PropTypes.string.isRequired,
      children: React.PropTypes.element
    },

    render: function () {
      return (
        <div className="secondary-nav half-height">
          <div className="container">
            <div className="project-name">
              <h1>{this.props.title}</h1>
              {this.props.children}
            </div>
          </div>
        </div>
      );
    }

  });

});
