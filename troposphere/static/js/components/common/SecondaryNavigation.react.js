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
        routes: React.PropTypes.array.isRequired,
        currentRoute: React.PropTypes.string.isRequired,
        canEditTitle: React.PropTypes.bool
      },

      getInitialState: function(){
        return {
          isEditing: false
        }
      },

      render: function () {

        var links = this.props.routes.map(function(route){
          var isCurrentRoute = (route.name.toLowerCase() === this.props.currentRoute);
          var className = isCurrentRoute ? "active" : null;
          return (
            <li className={className}>
              <a href={route.href}>
                <i className={'glyphicon glyphicon-' + route.icon}></i>
                {route.name}
              </a>
            </li>
          );
        }.bind(this));

        var titleClass = "project-name";
        if(this.state.isEditing) titleClass += " editing";

        return (
          <div className="secondary-nav">
            <div className="container">
              <div className={titleClass}>
                <h1>{this.props.title}</h1>
                <input type="text" value={this.props.title}/>
              </div>
              <ul className="secondary-nav-links">
                {links}
              </ul>
            </div>
          </div>
        );
      }

    });

  });
