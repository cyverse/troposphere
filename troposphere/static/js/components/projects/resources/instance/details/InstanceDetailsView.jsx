import React from "react";
import Backbone from "backbone";
import globals from "globals";

import subscribe from "utilities/subscribe";
import BreadcrumbBar from "components/projects/common/BreadcrumbBar";
import InstanceDetail from "components/common/InstanceDetail";

const InstanceDetailsView = React.createClass({
    displayName: "InstanceDetailsView",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        allocationSources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    render() {
        let { instance, project, allocationSources, params } = this.props;
        let { HelpLinkStore } = this.props.subscriptions;
        let helpLinks = HelpLinkStore.getAll();

        var breadcrumbs = [
            {
                name: "Resources",
                linksTo: `/projects/${project.id}/resources`,
                params: {
                    projectId: project.id
                }
            },
            {
                name: instance.get("name"),
                linksTo: `projects/${project.id}/instances/${instance.id}`,
                params: {
                    projectId: project.id,
                    instanceId: instance.id
                }
            }
        ];

        let requires = [project, instance, helpLinks];

        if (globals.USE_ALLOCATION_SOURCES) {
            requires.push(allocationSources)
        }

        // Use truthy check to see if loaded
        let loaded = requires.every(r => Boolean(r));
        if (!loaded) {
            return <div className="loading"></div>;
        }

        let props = {
            params,
            instance,
            project,
            allocationSources,
            helpLinks
        };


        return (
        <div>
            <BreadcrumbBar breadcrumbs={breadcrumbs} />
            <InstanceDetail { ...props} />
        </div>
        );
    }
});

export default subscribe(InstanceDetailsView, ["HelpLinkStore"]);
