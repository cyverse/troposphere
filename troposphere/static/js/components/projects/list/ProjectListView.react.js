import React from 'react';
import Backbone from 'backbone';
import ProjectList from './ProjectList.react';
import modals from 'modals';
import ProjectListHeader from '../common/ProjectListHeader.react';
import actions from 'actions';


export default React.createClass({
      displayName: "ProjectListView",

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      launchNewProjectModal: function () {
        modals.ProjectModals.create();
      },

      render: function () {
        return (
          <div>
            <ProjectListHeader title={this.props.projects.length + " Projects"}>
              <button className='btn btn-primary' onClick={this.launchNewProjectModal}>
                Create New Project
              </button>
            </ProjectListHeader>

            <div className="container">
              <ProjectList projects={this.props.projects}/>
            </div>
          </div>
        );
      }
});
