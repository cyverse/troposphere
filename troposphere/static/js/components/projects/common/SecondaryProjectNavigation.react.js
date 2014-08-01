/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/SecondaryNavigation.react',
    'actions/ProjectActions'
  ],
  function (React, Backbone, SecondaryNavigation, ProjectActions) {

    return React.createClass({

      propTypes: {
        currentRoute: React.PropTypes.string.isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onTitleChanged: function(text){
        ProjectActions.updateProjectAttributes(this.props.project, {name: text});
      },

      render: function () {
        var routes = [
          {
            name: "Resources",
            href: "/application/projects/" + this.props.project.id,
            icon: "th"
          }
        ];

        var additionalContent = (
          <ul className="options-bar navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="glyphicon glyphicon-cog"/>
                  Options
                  <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#" className="danger">
                      <i className="glyphicon glyphicon-trash"/>
                      Delete Project
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
        );

        return (
          <div>
            <SecondaryNavigation title={this.props.project.get('name')}
                                 routes={routes}
                                 currentRoute={this.props.currentRoute}
                                 canEditTitle={true}
                                 onTitleChanged={this.onTitleChanged}
                                 additionalContent={additionalContent}
            />
          </div>
        );

      }

    });

  });
