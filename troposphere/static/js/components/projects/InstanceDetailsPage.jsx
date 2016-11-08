import React from "react";
import Router from "react-router";

import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import InstanceDetailsView from "./resources/instance/details/InstanceDetailsView";
import globals from "globals";
import stores from "stores";

export default React.createClass({
    displayName: "InstanceDetailsPage",

    mixins: [Router.State],

    componentDidMount() {
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.HelpLinkStore.addChangeListener(this.updateState);

        if (globals.USE_ALLOCATION_SOURCES) {
            stores.AllocationSourceStore.addChangeListener(this.updateState)
        }
    },

    componentWillUnmount() {
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.HelpLinkStore.removeChangeListener(this.updateState);

        if (globals.USE_ALLOCATION_SOURCES) {
            stores.AllocationSourceStore.removeChangeListener(this.updateState)
        }
    },

    updateState() {
        this.forceUpdate();
    },

    render() {
        let project = stores.ProjectStore.get(Number(this.getParams().projectId));
        let instance = stores.InstanceStore.get(Number(this.getParams().instanceId));
        let helpLinks = stores.HelpLinkStore.getAll();
        let allocationSources = stores.AllocationSourceStore.getAll();

        let requires = [project, instance, helpLinks];

        if (globals.USE_ALLOCATION_SOURCES) {
            requires.push(allocationSources)
        }

        // Use truthy check to see if loaded
        let loaded = requires.every(r => Boolean(r))
        if (!loaded) {
            return <div className="loading"></div>;
        }

        let props = {
            project,
            instance,
            helpLinks,
            allocationSources,
        }

        return (
        <ProjectResourcesWrapper { ...props }>
            <InstanceDetailsView { ...props } />
        </ProjectResourcesWrapper>
        );
    }

});
