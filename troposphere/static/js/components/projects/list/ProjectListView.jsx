import React from "react";
import Backbone from "backbone";

import modals from "modals";

import Wrapper from 'components/common/ui/Wrapper';

import ProjectListHeader from "../common/ProjectListHeader";
import ProjectList from "./ProjectList";


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
        <div style={{ paddingTop: "30px" }}>
            <ProjectListHeader title={this.props.projects.length + " Projects"}>
                <button className="btn btn-primary" onClick={this.launchNewProjectModal}>
                    New Project
                </button>
            </ProjectListHeader>
            <Wrapper>
                <ProjectList projects={this.props.projects} />
            </Wrapper>
        </div>
        );
    }
});
