import React from "react";
import modals from "modals";
import moment from "moment";
import CopyButton from "components/common/ui/CopyButton";
import RefreshComponent from "components/projects/resources/instance/details/sections/metrics/RefreshComponent";
import stores from "stores";


export default React.createClass({
    displayName: "MyImageRequestsPage",

    getInitialState: function() {
        // start fetching the relevant models before the component is rendered
        stores.ImageRequestStore.fetchFirstPageWhere({
            new_machine_owner__username: stores.ProfileStore.get().id
        });
        return {};
    },

    componentDidMount: function() {
        stores.ProfileStore.addChangeListener(this.updateState);
        stores.ImageRequestStore.addChangeListener(this.updateState);
        stores.HelpLinkStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProfileStore.removeChangeListener(this.updateState);
        stores.ImageRequestStore.removeChangeListener(this.updateState);
        stores.HelpLinkStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    onEditImage: function(requestId) {
        modals.ImageModals.edit(stores.ImageRequestStore.get(requestId));
    },

    refreshHistory: function() {
        stores.ImageRequestStore.fetchFirstPageWhere({
            new_machine_owner__username: stores.ProfileStore.get().id
        });
        stores.ImageRequestStore.lastUpdated = Date.now();
        this.forceUpdate();
    },

    renderRefreshButton: function() {
        return (
        <span className="my-requests refresh-button"><RefreshComponent onRefreshClick={this.refreshHistory} timestamp={stores.ImageRequestStore.lastUpdated} delay={1000 * 30} /></span>
        );
    },

    render: function() {
        var username = stores.ProfileStore.get().id,
            helpLinks = stores.HelpLinkStore.getAll(),
            imagingDocsLink,
            requests;

        if (!username || !helpLinks) {
            return <div className="loading"></div>
        }

        imagingDocsLink = stores.HelpLinkStore.get("request-image");

        requests = stores.ImageRequestStore.getAll();

        var machineStateColumn,
            machineStateData;

        if (stores.ProfileStore.get().get("is_staff")) {
            machineStateColumn = (
                <th>
                    Machine State
                </th>
            );
        }

        if (!requests) {
            return <div className="loading"></div>;
        }

        if (!requests.models[0]) {
            return (
            <div className="container">
                <p style={{ marginBottom: "16px" }}>
                    {"Looking for more information about the imaging process? Check out the "}
                    <a href={imagingDocsLink.get("href")} target="_blank">documentation on imaging</a>.
                </p>
                <p>
                    You have not made any imaging requests.
                </p>
            </div>
            );
        }

        var displayRequests = requests.map(function(request) {

            let requestStatus = request.get("status").name;
            // set the color of the row based on the status of the request
            var trClass,
                endDateText = "N/A";
            switch (requestStatus) {
                case "completed":
                    trClass = "active";
                    break;
                case "approved":
                    trClass = "active";
                    break;
                case "validating":
                    trClass = "transition";
                    break;
                case "denied":
                    trClass = "error"
                    break;
                default:
                    trClass = ""
                    break;
            }

            if (stores.ProfileStore.get().get("is_staff")) {
                machineStateData = (<td>
                                        {request.get("old_status")}
                                    </td>);
            }

            if (request.get("end_date")) {
                endDateText = moment(request.get("end_date")).format("MMM D, YYYY h:mm:ss a");
            }

            var newMachineId = request.get("new_machine") ? request.get("new_machine").uuid : "N/A";
            var newMachineProvider = request.get("new_machine_provider") ? request.get("new_machine_provider").name : "Unknown";

            const { name, uuid } = request.get("instance");
            const requestDate = moment(request.get("start_date")).format("MMM D, YYYY h:mm:ss a");

            return (
                <tr className="card">
                    <td>
                       { name }
                       <div className="u-noWrap">
                           { uuid }
                           <CopyButton text={ uuid }/>
                       </div>
                    </td>
                    <td>
                       { requestDate }
                    </td>
                    <td>
                       { endDateText }
                    </td>
                    <td className="u-noWrap">
                       <span
                           className={`instance-status-light ${trClass}`}
                       />
                       { requestStatus }
                    </td>
                    { machineStateData }
                    <td>
                       { newMachineProvider }
                       <div className="u-noWrap">
                           { newMachineId }
                           { ( newMachineId !== "N/A" ) ?
                               <CopyButton text={ newMachineId }/> : null
                           }
                       </div>
                    </td>
               </tr>
            );
        }.bind(this));

        return (
        <div className="container">
            <p style={{ marginBottom: "16px" }}>
                {"Looking for more information about the imaging process? Check out the "}
                <a href={imagingDocsLink.get("href")} target="_blank">documentation on imaging</a>.
            </p>
            {this.renderRefreshButton()}
            <table className="image-requests cy-Table">
                <tbody>
                    <tr className="card">
                        <th>
                            Base Instance
                        </th>
                        <th>
                            Date Requested
                        </th>
                        <th>
                            Date Completed
                        </th>
                        <th>
                            Status
                        </th>
                        {machineStateColumn}
                        <th>
                            New Machine ID
                        </th>
                    </tr>
                    {displayRequests}
                </tbody>
            </table>
        </div>
        );
    },

});
