define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Breadcrumb = require('./Breadcrumb.react');
  return React.createClass({

    propTypes: {
      breadcrumbs: React.PropTypes.array.isRequired,
      //breadcrumb: React.PropTypes.object.isRequired,
      //step: React.PropTypes.number.isRequired,
      onCrumbClick: React.PropTypes.func.isRequired
    },

    renderCrumbs: function () {
      var onMouseOn = this.props.onMouseOn;
      var onMouseOff = this.props.onMouseOff;
      var length = this.props.breadcrumbs.length;
      //var step = this.props.step;
      var self = this;
      var inactiveCount = 0;
      var restCount = 0;
      for (var breadcrumb in this.props.breadcrumbs) {
        if (this.props.breadcrumbs[breadcrumb].state === 'inactive') {
          inactiveCount++;
        }
        else if (this.props.breadcrumbs[breadcrumb].state !== 'active') {
          restCount++;
        }
      }
      var baseWidth = (100 / length);
      var activeWidth = baseWidth * 2;
      var standardWidth = ((100 - activeWidth) * (2 / 3)) / restCount;
      var inactiveWidth = ((100 - activeWidth) * (1 / 3)) / inactiveCount;

      var breadcrumbs = this.props.breadcrumbs.map(function (breadcrumb, index, array) {
        switch (breadcrumb.state) {
          case 'inactive':
            width = inactiveWidth;
            break;
          case 'active':
            width = activeWidth;
            break;
          default:
            width = standardWidth;
        }
        return (
          <Breadcrumb key={breadcrumb.name}
                      onMouseOn={onMouseOn}
                      onMouseOff={onMouseOff}
                      breadcrumb={breadcrumb}
                      width={width}
                      onClick={self.crumbClicked}
            />
        )
      });
      return breadcrumbs;
    },
    crumbClicked: function (breadcrumb) {
      if (breadcrumb.step < this.props.step) {
        this.props.onCrumbClick(breadcrumb);
      }
    },
    render: function () {

      return (
        <div className="breadcrumb">
          {this.renderCrumbs()}
        </div>
      );
    }

  });

});
