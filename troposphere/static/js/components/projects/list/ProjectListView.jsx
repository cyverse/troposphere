import React from "react";
import Backbone from "backbone";
import RaisedButton from 'material-ui/RaisedButton';
import ProjectList from "./ProjectList";
import modals from "modals";
import ProjectListHeader from "../common/ProjectListHeader";


export default React.createClass({
    displayName: "ProjectListView",

    propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    launchNewProjectModal: function() {
        modals.ProjectModals.create();
    },

    render: function() {
        return (
        <div>
            <ProjectListHeader title={this.props.projects.length + " Projects"}>
                <RaisedButton 
                    primary
                    onTouchTap={this.launchNewProjectModal}
                    label="Create New Project"
                />
            </ProjectListHeader>
            <div className="container">
                <ProjectList projects={this.props.projects} />
            </div>
        </div>
        );
    }
});
