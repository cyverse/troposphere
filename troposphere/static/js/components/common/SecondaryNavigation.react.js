/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './EditableInputField.react',
    'react-router'
  ],
  function (React, Backbone, EditableInputField, Router) {

    var ENTER_KEY = 13;

    return React.createClass({

      propTypes: {
        title: React.PropTypes.string,
        routes: React.PropTypes.array.isRequired,
        currentRoute: React.PropTypes.string.isRequired,
        canEditTitle: React.PropTypes.bool,
        onTitleChanged: React.PropTypes.func,
        additionalContent: React.PropTypes.node
      },

      render: function () {

        var links = this.props.routes.map(function(route){
          var isCurrentRoute = (route.name.toLowerCase() === this.props.currentRoute);
          var className = isCurrentRoute ? "active" : null;
          if(!route.linksTo) {
            return (
              <li key={route.name} className={className}>
                <a href={route.href}>
                  <i className={'glyphicon glyphicon-' + route.icon}></i>
                {route.name}
                </a>
              </li>
            );
          }else{
            return (
              <li key={route.name}>
                <Router.Link to={route.linksTo} params={route.params} className={className}>
                  <i className={'glyphicon glyphicon-' + route.icon}></i>
                  {route.name}
                </Router.Link>
              </li>
            );
          }
        }.bind(this));

        var titleContent;
        if(this.props.title) {
          titleContent = (
            <div className="project-name">
              <h1>
                {this.props.title}
              </h1>
            </div>
          )
        }

        var hasAdditionalContent = this.props.additionalContent;

        return (
          <div className="secondary-nav">
            <div className="container">
              {titleContent}
              <ul className="secondary-nav-links">
                {links}
              </ul>
             {hasAdditionalContent ? this.props.additionalContent : null}
            </div>
          </div>
        );
      }

    });

  });
