define(function (require) {

    var React = require('react'),
        Backbone = require('backbone'),
        Breadcrumb = require('./Breadcrumb.react.js');
    return React.createClass({

      propTypes: {
        breadcrumbs: React.PropTypes.array.isRequired,
        step: React.PropTypes.number.isRequired,
        onCrumbClick: React.PropTypes.func.isRequired
      },

      renderCrumbs: function() {
        var step = this.props.step;
        var self = this;
        var breadcrumbs = this.props.breadcrumbs.map(function(breadcrumb, index, array){
          return (
            <Breadcrumb key={breadcrumb.name}
                        breadcrumb={breadcrumb}
                        onClick={self.crumbClicked}
            />
          )
        });
        return breadcrumbs;
      },
      crumbClicked: function (breadcrumb) {
          if(breadcrumb.step < this.props.step) {
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
