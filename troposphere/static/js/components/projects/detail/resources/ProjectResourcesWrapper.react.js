import React from 'react';
import Backbone from 'backbone';
import SubMenu from './SubMenu.react';

export default React.createClass({
    displayName: "ProjectResourcesWrapper",

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      children: React.PropTypes.element.isRequired
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
