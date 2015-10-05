
define(
  [
    'react',
    'backbone',
    './SubMenu.react'
  ],
  function (React, Backbone, SubMenu) {

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      children: React.PropTypes.element.isRequired
    },

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        children: React.PropTypes.component.isRequired
      },

      render: function () {
        return (
          <div className="container">
                <div className="td-sub-menu">
                  <SubMenu project={this.props.project}/>
                </div>
                <div className="td-project-content">
                  {this.props.children}
                </div>
          </div>
        );
      }

    });

  });
