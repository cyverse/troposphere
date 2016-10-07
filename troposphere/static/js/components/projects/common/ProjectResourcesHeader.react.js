import React from "react";
import Backbone from "backbone";
import Router from "react-router";
import Glyphicon from "components/common/Glyphicon.react";
import modals from "modals";
import stores from "stores";

import { VerticalMenu, Button, Sheet, Title } from 'troposphere-ui';

export default React.createClass({
    displayName: "SecondaryProjectNavigation",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDeleteProject: function(e) {
        e.preventDefault();

        var project = this.props.project,
            projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
            projectImages = stores.ProjectImageStore.getImagesFor(project),
            projectExternalLinks = stores.ProjectExternalLinkStore.getExternalLinksFor(project),
            projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);

        if (projectInstances.length > 0 || projectImages.length > 0 || projectExternalLinks.length > 0 || projectVolumes.length > 0) {
            modals.ProjectModals.explainProjectDeleteConditions();
        } else {
            modals.ProjectModals.destroy(project);
        }
    },

    renderRoute: function(name, linksTo, icon, params) {
        return (
        <li key={name}>
            <Router.Link to={linksTo} params={params}>
                <Glyphicon name={icon} />
                <span>{name}</span>
            </Router.Link>
        </li>
        )
    },

    render: function () {
        var project = this.props.project;

        return (
            <div style = {{ maxWidth: "1200px", margin: "auto" }} >
                <div style = {{ display: "inline-block" }} >
                    <Title h1 headline>                   
                        { project.get('name') }
                    </Title>
                </div>
                <div style = {{ 
                        float: "right",
                        position: "relative",
                        display: "inline-block",
                    }} 
                >
                    <VerticalMenu
                        menuItemList = {[
                            {
                                render: "Delete Project",
                                onClick: this.onDeleteProject
                            }
                        ]}
                     
                    />
                </div>
            </div>
        );
    }
});
