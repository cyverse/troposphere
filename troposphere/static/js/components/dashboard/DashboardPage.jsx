import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

import globals from "globals";
import context from "context";
import modals from "modals";
import stores from "stores";
import InstanceHistoryList from "./InstanceHistoryList";
import ResourceStatusSummaryPlot from "./plots/ResourceStatusSummaryPlot";
import AllocationSourcePlot from "./plots/AllocationSourcePlot";
import ProviderAllocationPlot from "./plots/ProviderAllocationPlot";
import ProviderSummaryLinePlot from "./plots/ProviderSummaryLinePlot";
import CallToAction from "./CallToAction";
import { trackAction } from "../../utilities/userActivity";

// images
import launch_instance from "themeImages/icon_launchnewinstance.png";
import settings from "themeImages/icon_settings.png";
import help from "themeImages/icon_gethelp.png";

export default React.createClass({
    displayName: "DashboardPage",

    renderRequestMoreResources: function(e) {
        e.preventDefault();
        modals.HelpModals.requestMoreResources();
        trackAction("made-resource-request", {
            element: "from-dashboard"
        });
    },

    updateState: function() {
        this.forceUpdate();
    },

    componentDidMount: function() {
        stores.SizeStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.MaintenanceMessageStore.addChangeListener(this.updateState);
        stores.ImageStore.addChangeListener(this.updateState);
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.MaintenanceMessageStore.removeChangeListener(this.updateState);
        stores.ImageStore.removeChangeListener(this.updateState);
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
    },

    render: function() {
        let providers = stores.ProviderStore.getAll(),
            current_user = context.profile.get('username'),
            identities = stores.IdentityStore.ownedIdentities(current_user),
            projects = stores.ProjectStore.getAll(),
            maintenanceMessages = stores.MaintenanceMessageStore.getAll(),
            images = stores.ImageStore.getAll(),
            instances = stores.InstanceStore.getAll(),
            volumes = stores.VolumeStore.getAll(),
            sizes = stores.SizeStore.fetchWhere({
                "archived": "true",
                "page_size": 250
            });

        // Test that all resources are truthy
        let resourcesLoaded =
            [ providers
            , identities
            , projects
            , maintenanceMessages
            , images
            , instances
            , volumes
            , sizes].every(obj => obj)

        if (!resourcesLoaded) {
            return <div className="loading"></div>;
        }

        let renderAllocationPlot = globals.USE_ALLOCATION_SOURCES
            ? <AllocationSourcePlot />
            : <ProviderAllocationPlot providers={providers} identities={identities} />;

        return (
        <div id="dashboard-view">
            <div style={{ paddingTop: "30px" }} className="container">
                    <h2 className="t-headline">Getting Started</h2>
                    <div className="row calls-to-action">
                        <div className="col-md-4 col-sm-12">
                            <CallToAction title="Launch New Instance"
                                image={launch_instance}
                                description="Browse Atmosphere's list of available images and select one to launch a new instance."
                                linksTo="images" />
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <CallToAction title="Browse Help Resources"
                                image={help}
                                description="View a video tutorial, read the how-to guides, or email the Atmosphere support team."
                                linksTo="help" />
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <CallToAction title="Change Your Settings"
                                image={settings}
                                description="Modify your account settings, view your resource quota, or request more resources."
                                linksTo="settings" />
                        </div>
                    </div>
                    <div 
                        className="resource-header clearfix"
                        style={{
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <h2 className="t-headline">
                            Resources Used
                        </h2>
                        <RaisedButton
                            style={{
                                marginLeft: "20px",
                                marginBottom: "10px",
                            }}
                            primary
                            onTouchTap={this.renderRequestMoreResources}
                            label={ `Need more ${String.fromCharCode(63)}` }
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            {renderAllocationPlot}
                            <ProviderSummaryLinePlot providers={providers}
                                identities={identities}
                                instances={instances}
                                volumes={volumes}
                                sizes={sizes} />
                        </div>
                        <div className="col-md-4">
                            <ResourceStatusSummaryPlot title="Instances" resources={instances} />
                            <ResourceStatusSummaryPlot title="Volumes" resources={volumes} />
                        </div>
                    </div>
                    <InstanceHistoryList/>
                </div>
        </div>
        );
    }
});
