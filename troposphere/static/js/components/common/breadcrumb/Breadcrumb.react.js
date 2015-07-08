define(function (require) {

  var React = require('react'),
      Router = require('react-router');

  return React.createClass({

    propTypes: {
      breadcrumb: React.PropTypes.object.isRequired,
      onClick: React.PropTypes.func.isRequired,
    },

    renderLink: function() {
      var class_names = this.props.breadcrumb.state;
      return (
          <div className={class_names} onClick={this.crumbClicked}>
            {this.props.breadcrumb.name}
          </div>
        );
    },
    crumbClicked: function() {
        if(!this.props.breadcrumb.inactive) {
            return this.props.onClick(this.props.breadcrumb);
        }
    },
    render: function () {
      return this.renderLink();
    }

  });

});
