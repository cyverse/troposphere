/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Breadcrumb.react'
  ],
  function (React, Backbone, Breadcrumb) {

    return React.createClass({

      propTypes: {
        breadcrumbs: React.PropTypes.array.isRequired
      },

      onReturnToPreviousPage: function(e){
        e.preventDefault();
        Backbone.history.history.back();
      },

      render: function () {
//        var breadcrumbComponents = [];
//        for(var i = 0; i < this.props.breadcrumbs.length; i++){
//          var breadcrumb = this.props.breadcrumbs[i];
//          var isCurrentLocation = false;
//          if((this.props.breadcrumbs.length -1) === i) isCurrentLocation = true;
//          breadcrumbComponents.push((
//            <Breadcrumb breadcrumb={breadcrumb} isCurrentLocation={isCurrentLocation}/>
//          ))
//        }

        var breadcrumbs = this.props.breadcrumbs.map(function(breadcrumb, index, array){
          var isCurrentLocation = (array.length - 1) === index ? true : false;
          return (
            <Breadcrumb key={breadcrumb.name}
                        breadcrumb={breadcrumb}
                        isCurrentLocation={isCurrentLocation}
            />
          )
        });

        return (
          <div className="button-bar" style={{padding: "17px 0px"}}>
            <a className="nav-back btn btn-default" style={{"padding":"3px 10px 5px 11px !important"}} onClick={this.onReturnToPreviousPage}>
              <span className="glyphicon glyphicon-arrow-left" style={{"font-size":"11px"}}></span>
            </a>
            {breadcrumbs}
          </div>
        );
      }

    });

  });
