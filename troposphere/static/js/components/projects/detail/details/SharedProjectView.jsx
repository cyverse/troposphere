import CryptoJS from "crypto-js";
import React from "react";
import { Link, withRouter } from "react-router";

import subscribe from 'utilities/subscribe';
import Gravatar from "components/common/Gravatar";
import CopyButton from "components/common/ui/CopyButton";
import RefreshComponent from "components/projects/resources/instance/details/sections/metrics/RefreshComponent";

const SharedProjectView = React.createClass({
    displayName: "SharedProjectView",

    getInitialState: function() {
        let { InstanceStore, ProjectStore } = this.props.subscriptions,
            sharedProject = ProjectStore.getSharedProject();
        return {
            project: sharedProject,
            lastUpdated: InstanceStore.lastUpdated,
        }
    },
    onSelect: function(instance) {
        console.log("Clicked me!");
        let { router } = this.props;
        router.push(`/projects/shared/instances/${instance.id}`);
    },
    // ------
    // Render
    // ------
    refreshInstances: function() {
        let {InstanceStore} = this.props.subscriptions;
        InstanceStore.clearCache();
        InstanceStore.getAll();
        this.setState({lastUpdated: InstanceStore.lastUpdated});
    },


    renderRefreshButton: function() {
        return (
        <span className="my-requests refresh-button"><RefreshComponent onRefreshClick={this.refreshInstances} timestamp={this.state.lastUpdated} delay={1000 * 30} /></span>
        );
    },
    renderSharedResourcesTable: function() {
        var project = this.state.project,
            { InstanceStore } = this.props.subscriptions,
            instances = InstanceStore.getSharedInstances();

        if (!instances.models[0]) {
            return (
             <p style={{ marginBottom: "16px" }}>
                 {"It looks like you don't have any shared resources. To share a resource ... <Insert meaningful text here>"}
             </p>
            );
        }

        let { ProfileStore } = this.props.subscriptions;

        var instanceRows = instances.map(function(instance) {
            let instanceStatus = instance.get("status"),
                instanceName = instance.get('name'),
                instanceOwner = instance.get('user').username,
                instanceIP = instance.get('ip_address'),
                instanceID = instance.get('uuid'),
                instanceHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
                type = ProfileStore.get().get("icon_set"),
                iconSize = 18;
            // set the color of the row based on the status of the instance
            var trClass,
                endDateText = "N/A";
            switch (instanceStatus) {
                case "active":
                    trClass = "active";
                    break;
                default:
                    trClass = "transition"; //"";
                    break;
            }

            return (
                <tr key={instanceID} className="card" onClick={() => this.onSelect(instance)} style={{ cursor: "pointer" }}>
                    <td>
                    <Link to={`/projects/shared/instances/${instance.id}`}>
                                    <Gravatar hash={instanceHash} size={iconSize} type={type} />
                                   { instanceName }
                    </Link>
                    </td>
                    <td>
                       { instanceOwner }
                    </td>
                    <td className="u-noWrap">
                       <span
                           className={`instance-status-light ${trClass}`}
                       />
                       { instanceStatus }
                    </td>
                    <td>
                       { instanceIP }
                       <div className="u-noWrap">
                           { ( instanceIP !== "N/A" && instanceIP !== "0.0.0.0" ) ?
                               <CopyButton text={ instanceIP }/> : null
                           }
                       </div>
                    </td>
               </tr>
            );
        }.bind(this));
        return (
            <table className="image-requests cy-Table table clearfix">
                <tbody>
                    <tr className="card">
                        <th>
                            Instance Name
                        </th>
                        <th>
                            Shared By
                        </th>
                        <th>
                            Status
                        </th>
                        <th>
                            IP Address
                        </th>
                    </tr>
                    {instanceRows}
                </tbody>
            </table>
        );
    },
    render: function() {
        var project = this.state.project,
            { HelpLinkStore } = this.props.subscriptions,
            helpLinks = HelpLinkStore.getAll();

        if (!helpLinks) {
            return (<div className="loading" />);
        }
        let instanceSharingLink = HelpLinkStore.get("instance-sharing") || HelpLinkStore.get('request-image'); //FIXME: remove || later.

        return (
        <div className="container">
            <p style={{ marginBottom: "16px" }}>
                {"Looking for more information about the imaging process? Check out the "}
                <a href={instanceSharingLink.get("href")} target="_blank">documentation on imaging</a>.
            </p>
            {this.renderRefreshButton()}
            {this.renderSharedResourcesTable()}
        </div>
        );
    }
});

export default subscribe( withRouter(SharedProjectView), ["HelpLinkStore", "InstanceStore", "ProjectStore", "ProfileStore"]);
