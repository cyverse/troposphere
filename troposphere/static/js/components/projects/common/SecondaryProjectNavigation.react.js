/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/SecondaryNavigation.react',
    'actions/ProjectActions'
  ],
  function (React, SecondaryNavigation, ProjectActions) {

    return React.createClass({

      propTypes: {
        currentRoute: React.PropTypes.string.isRequired,
        project: React.PropTypes.string.isRequired
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

        return (
          <div>
            <SecondaryNavigation title={this.props.project.get('name')}
                                 routes={routes}
                                 currentRoute={this.props.currentRoute}
                                 canEditTitle={true}
                                 onTitleChanged={this.onTitleChanged}
            />
          </div>
        );

      }

    });

  });
