/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './EditableInputField.react'
  ],
  function (React, Backbone, EditableInputField) {

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
          return (
            <li key={route.name} className={className}>
              <a href={route.href}>
                <i className={'glyphicon glyphicon-' + route.icon}></i>
                {route.name}
              </a>
            </li>
          );
        }.bind(this));

        var hasAdditionalContent = this.props.additionalContent;

        return (
          <div className="secondary-nav">
            <div className="container">
              <div className="project-name">
                <h1>
                  {this.props.title}
                </h1>
              </div>
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
