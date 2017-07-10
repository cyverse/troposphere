import React from "react";
import Backbone from "backbone";
import ExternalLinkInfoSection from "./sections/ExternalLinkInfoSection";
import ExternalLinkActions from "./sections/ExternalLinkActions";
import BreadcrumbBar from "components/projects/common/BreadcrumbBar";

export default React.createClass({
    displayName: "ExternalLinkDetailsView",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        link: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var project = this.props.project,
            link = this.props.link;

        var breadcrumbs = [
            {
                name: "Resources",
                linksTo: `projects/${project.id}/resources`,
                params: {
                    projectId: project.id
                }
            },
            {
                name: link.get("title"),
                linksTo: `projects/${project.id}/links/${link.id}`,
                params: {
                    projectId: project.id,
                    linkId: link.id
                }
            }
        ];

        return (
        <div>
            <BreadcrumbBar breadcrumbs={breadcrumbs} />
            <div className="row resource-details-content">
                <div className="col-md-9 resource-detail-sections">
                    <ExternalLinkInfoSection link={link} />
                    <hr/>
                </div>
                <div className="col-md-3 resource-actions">
                    <ExternalLinkActions link={link} project={project} />
                </div>
            </div>
        </div>
        );
    }
});
