import actions from "actions";
import Backbone from "backbone";
import modals from "modals";
import React from "react";
import stores from "stores";
import RaisedButton from "material-ui/RaisedButton";
import WaitingIndicator from "components/common/ui/WaitingIndicator";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import IdentitySelect from "../instance/launch/components/IdentitySelect";

export default React.createClass({
    displayName: "VolumeCreateModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model),
    },

    isSubmittable: function() {
        var identities = stores.IdentityStore.getAll(),
            maintenanceMessages = stores.MaintenanceMessageStore.getAll(),
            volumes = stores.VolumeStore.getAll();

        if (!identities || !maintenanceMessages || !volumes) return false;

        // Make sure the selected provider is not in maintenance
        var selectedIdentity = stores.IdentityStore.get(this.state.identityId),
            isProviderInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(selectedIdentity.get("provider").id);

        // Disable the launch button if the user hasn't provided a name, size or identity for the volume
        var hasProvider = !!this.state.identityId,
            hasName = !!this.state.volumeName.trim(),
            hasSize = !!this.state.volumeSize,
            providerNotInMaintenance = !isProviderInMaintenance,
            hasEnoughQuotaForStorage = this.hasEnoughQuotaForStorage(selectedIdentity, this.state.volumeSize, volumes),
            hasEnoughQuotaForStorageCount = this.hasEnoughQuotaForStorageCount(selectedIdentity, volumes);

        return (
        hasProvider &&
        hasName &&
        hasSize &&
        providerNotInMaintenance &&
        hasEnoughQuotaForStorage &&
        hasEnoughQuotaForStorageCount
        );
    },

    //
    // Mounting & State
    // ----------------
    //

    getState: function() {
        var state = this.state,
            identities = stores.IdentityStore.getAll();

        // Use selected identity or default to the first one
        if (identities) {
            state.identityId = state.identityId || identities.first().id;
        }

        return state;
    },

    getInitialState: function() {
        var identities = stores.IdentityStore.getAll();

        return {
            waitingOnCreate: false,
            volumeName: "",
            volumeSize: 1,
            identityId: identities ? identities.first().id : null
        };
    },

    updateState: function() {
        if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function() {
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
        stores.MaintenanceMessageStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
        stores.MaintenanceMessageStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {

        let identityId = this.state.identityId,
            identity = stores.IdentityStore.get(identityId);

        let createData = {
            volumeName: this.state.volumeName.trim(),
            volumeSize: this.state.volumeSize,
            project: this.props.project,
            onSuccess: () => { this.hide(); },
            identity
        }

        actions.VolumeActions.createV2(createData);
        this.setState({
            waitingOnCreate: true,
        });
    },


    //
    // Custom Modal Callbacks
    // ----------------------
    //

    onProviderIdentityChange: function(e) {
        var newIdentityId = e.target.value;
        this.setState({
            identityId: newIdentityId
        });
    },

    onVolumeNameChange: function(e) {
        var newVolumeName = e.target.value;
        this.setState({
            volumeName: newVolumeName
        });
    },

    onVolumeSizeChange: function(e) {
        // todo: Don't let the user enter a value < 1, but doing it this way
        // doesn't let them hit backspace to remove the default 1 and start
        // typing a number.  Instead we should check for the onBlur event and
        // handle it then so it's only when they've left the input box.  But
        // probably better over all just to tell them the value has to be > 1
        // and don't magically change it for them.
        //if(e.target.value < 1) e.target.value = 1;
        var newVolumeSize = Number(e.target.value);
        this.setState({
            volumeSize: newVolumeSize
        });
    },

    //
    // Helper Functions
    //

    hasEnoughQuotaForStorage: function(identity, size, volumes) {
        var quota = identity.get("quota");
        var maximumAllowed = quota.storage;
        var projected = size;
        var currentlyUsed = identity.getStorageUsed(volumes);

        return (projected + currentlyUsed) <= maximumAllowed;
    },

    handleResourceRequest: function(e) {
        e.preventDefault();
        this.hide();
        modals.HelpModals.requestMoreResources();
    },

    hasEnoughQuotaForStorageCount: function(identity, volumes) {
        var quota = identity.get("quota");
        var maximumAllowed = quota.storage_count;
        var projected = 1;
        var currentlyUsed = identity.getStorageCountUsed(volumes);

        return (projected + currentlyUsed) <= maximumAllowed;
    },

    //
    // Render
    // ------
    //

    renderProgressBar: function(message, currentlyUsedPercent, projectedPercent, overQuotaMessage) {
        var currentlyUsedStyle = {
            width: currentlyUsedPercent + "%"
        };
        var projectedUsedStyle = {
            width: projectedPercent + "%",
            opacity: "0.6"
        };
        var totalPercent = currentlyUsedPercent + projectedPercent;
        var barTypeClass;

        if (totalPercent <= 50) {
            barTypeClass = "progress-bar-success";
        } else if (totalPercent <= 100) {
            barTypeClass = "progress-bar-warning";
        } else {
            barTypeClass = "progress-bar-danger";
            projectedUsedStyle.width = (100 - currentlyUsedPercent) + "%";
            message = overQuotaMessage;
        }

        return (
        <div className="quota-consumption-bars">
            <div className="progress">
                <div className="value">
                    {Math.round(currentlyUsedPercent + projectedPercent) + "%"}
                </div>
                <div className={"progress-bar " + barTypeClass} style={currentlyUsedStyle}></div>
                <div className={"progress-bar " + barTypeClass} style={projectedUsedStyle}></div>
            </div>
            <div>
                {message}
            </div>
        </div>
        );
    },

    renderStorageConsumption: function(identity, size, volumes) {
        var quota = identity.get("quota");
        var maximumAllowed = quota.storage;
        var projected = size;
        var currentlyUsed = identity.getStorageUsed(volumes);

        // convert to percentages
        var projectedPercent = projected / maximumAllowed * 100;
        var currentlyUsedPercent = currentlyUsed / maximumAllowed * 100;

        var message = "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted GBs of Storage.";
        var overQuotaMessage = (
        <div>
            <strong>Storage quota exceeded.</strong>
            <span>{" Choose a smaller size or delete an existing volume."}</span>
        </div>
        );

        return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
    },

    renderStorageCountConsumption: function(identity, size, volumes) {
        var quota = identity.get("quota");
        var maximumAllowed = quota.storage_count;
        var projected = 1;
        var currentlyUsed = identity.getStorageCountUsed(volumes);

        // convert to percentages
        var projectedPercent = projected / maximumAllowed * 100;
        var currentlyUsedPercent = currentlyUsed / maximumAllowed * 100;

        var message = "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted Volumes.";
        var overQuotaMessage = (
        <div>
            <strong>Volume quota exceeded.</strong>
            <span>{" You must delete an existing volume before creating a new one."}</span>
        </div>
        );

        return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
    },

    renderBody: function() {
        var identities = stores.IdentityStore.getAll(),
            providers = stores.ProviderStore.getAll(),
            volumes = stores.VolumeStore.getAll(),
            identityId = this.state.identityId,
            name = this.state.volumeName,
            size = this.state.volumeSize,
            { waitingOnCreate } = this.state,
            identity;

        if (!identities || !providers || !volumes) return <div className="loading"></div>;

        identity = identities.get(identityId);

        return (
        <div role="form">
            <div className="modal-section form-horizontal">
                <h4 className="t-body-2">Volume Details</h4>
                <div className="form-group">
                    <label htmlFor="volumeName" className="col-sm-3 control-label">
                        Volume Name
                    </label>
                    <div className="col-sm-9">
                        <input type="text"
                            className="form-control"
                            value={name}
                            disabled={waitingOnCreate}
                            onChange={this.onVolumeNameChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="volumeSize" className="col-sm-3 control-label">
                        Volume Size (GB)
                    </label>
                    <div className="col-sm-9">
                        <input type="number"
                            className="form-control"
                            disabled={waitingOnCreate}
                            value={size}
                            onChange={this.onVolumeSizeChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="identity" className="col-sm-3 control-label">
                        Provider
                    </label>
                    <div className="col-sm-9">
                        <IdentitySelect identityId={identityId}
                            disabled={waitingOnCreate}
                            identities={identities}
                            providers={providers}
                            onChange={this.onProviderIdentityChange} />
                    </div>
                </div>
            </div>
            <div className="modal-section">
                <h4 className="t-body-2"><span>Projected Resource Usage</span> <a className="modal-link" href="#" onClick={this.handleResourceRequest}>{"Need more resources?"}</a></h4>
                {this.renderStorageConsumption(identity, size, volumes)}
                {this.renderStorageCountConsumption(identity, size, volumes)}
            </div>
        </div>
        );
    },

    render: function() {
        let { waitingOnCreate } = this.state;

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Create Volume</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton 
                            style={{ marginRight: "10px" }}
                            onTouchTap={this.cancel}
                            label="Cancel"
                        />
                        { !waitingOnCreate ?
                        <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            disabled={!this.isSubmittable()}
                            label="Create volume"
                        /> : <WaitingIndicator label="Creating ..."/> }
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
