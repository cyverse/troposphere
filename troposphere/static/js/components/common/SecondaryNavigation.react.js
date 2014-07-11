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
        currentRoute: React.PropTypes.string.isRequired
      },

      render: function () {

        var links = this.props.routes.map(function(route){
          var isCurrentRoute = (route.name.toLowerCase() === this.props.currentRoute);
          var className = isCurrentRoute ? "active" : null;
          return (
            <li className={className}><a href={route.href}>{route.name}</a></li>
          );
        }.bind(this));

        return (
          <div className="secondary-nav">
            <div className="container">
              <div className="project-name">
                <h1>{this.props.title}</h1>
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
