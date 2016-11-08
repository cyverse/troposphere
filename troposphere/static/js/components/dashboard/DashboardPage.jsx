import React from "react";

import globals from "globals";
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
let launch_instance = globals.THEME_URL + "/images/icon_launchnewinstance.png",
    settings = globals.THEME_URL + "/images/icon_settings.png",
    help = globals.THEME_URL + "/images/icon_gethelp.png";

export default React.createClass({
    displayName: "DashboardPage",

    renderRequestMoreResources: function(e) {
        e.preventDefault();
        modals.HelpModals.requestMoreResources();
        trackAction("made-resource-request", {
            element: "from-dashboard"
        });
    },

    getState: function() {
        return {};
    },

    updateState: function() {
        if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function() {
        stores.SizeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.SizeStore.removeChangeListener(this.updateState);
    },

    render: function() {

        let providers = stores.ProviderStore.getAll(),
            identities = stores.IdentityStore.getAll(),
            projects = stores.ProjectStore.getAll(),
            maintenanceMessages = stores.MaintenanceMessageStore.getAll(),
            images = stores.ImageStore.getAll(),
            instances = stores.InstanceStore.getAll(),
            volumes = stores.VolumeStore.getAll(),
            sizes = stores.SizeStore.fetchWhereNoCache({
                "archived": "true",
                "page_size": 250
            });

        if (providers == null || identities == null || projects == null || maintenanceMessages == null || images == null || instances == null || volumes == null || sizes == null) {
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
                    <div className="resource-header clearfix">
                        <h2 className="t-headline pull-left">Resources Used</h2>
                        <a href="#" className="btn btn-sm btn-primary pull-left" onClick={this.renderRequestMoreResources}>Need more{String.fromCharCode(63)}</a>
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
