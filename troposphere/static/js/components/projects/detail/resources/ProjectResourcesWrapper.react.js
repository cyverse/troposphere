import React from 'react';
import Backbone from 'backbone';
import SubMenu from './Submenu.react';

export default React.createClass({

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      children: React.PropTypes.element.isRequired
    },

    displayName: "ProjectResourcesWrapper",

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
