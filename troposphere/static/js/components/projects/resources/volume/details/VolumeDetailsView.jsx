import React from "react";
import Backbone from "backbone";
import VolumeDetailsSection from "./sections/VolumeDetailsSection";
import VolumeInfoSection from "./sections/VolumeInfoSection";
import BreadcrumbBar from "components/projects/common/BreadcrumbBar";
import VolumeActionsAndLinks from "./actions/VolumeActionsAndLinks";


export default React.createClass({
    displayName: "VolumeDetailsView",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var project = this.props.project,
            volume = this.props.volume;

        var breadcrumbs = [
            {
                name: "Resources",
                linksTo: `projects/${project.id}/resources`,
                params: {
                    projectId: project.id
                }
            },
            {
                name: volume.get("name"),
                linksTo: `projects/${project.id}/volumes/${volume.id}`,
                params: {
                    projectId: project.id,
                    volumeId: volume.id
                }
            }
        ];

        return (
        <div>
            <BreadcrumbBar breadcrumbs={breadcrumbs} />
            <div className="row resource-details-content">
                <div className="col-md-9 resource-detail-sections">
                    <VolumeInfoSection volume={volume} />
                    <hr/>
                    <VolumeDetailsSection volume={volume} />
                    <hr/>
                </div>
                <div className="col-md-3 resource-actions">
                    <VolumeActionsAndLinks volume={volume} project={project} />
                </div>
            </div>
        </div>
        );
    }

});
