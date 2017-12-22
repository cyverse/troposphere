import React from "react";

import ProjectResourcesWrapper from "./detail/resources/ProjectResourcesWrapper";
import InstanceDetailsView from "./resources/instance/details/InstanceDetailsView";

import globals from "globals";
import stores from "stores";


export default React.createClass({
    displayName: "InstanceDetailsPage",

    propTypes: {
        params: React.PropTypes.object
    },

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
        let { projectId, instanceId } = this.props.params;
        let project = stores.ProjectStore.get(projectId);
        let instance = stores.InstanceStore.get(instanceId);
        let helpLinks = stores.HelpLinkStore.getAll();
        let allocationSources = stores.AllocationSourceStore.getAll();

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
            params: this.props.params,
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
