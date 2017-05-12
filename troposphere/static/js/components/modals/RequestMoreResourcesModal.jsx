import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import AUCalculator from "components/common/AUCalculator";
import stores from "stores";
import globals from "globals";

export default React.createClass({
    displayName: "RequestMoreResourcesModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        identity: React.PropTypes.number,
        onConfirm: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        let identities = stores.IdentityStore.getAll();
        let defaultIdentity;
        if (identities) {
            defaultIdentity = identities.first().id;
        }

        return {
            identity: this.props.identity || defaultIdentity,
            resources: "",
            reason: ""
        };
    },

    updateState: function() {
        let { identity } = this.state;
        let identities = stores.IdentityStore.getAll();

        if (!identity && identities) {
            this.setState({ identity: identities.first().id })
        }

        this.forceUpdate()
    },

    componentDidMount: function() {
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.ResourceRequestStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.ResourceRequestStore.removeChangeListener(this.updateState);
    },

    isSubmittable: function() {
        var hasResources = !!this.state.resources;
        var hasReason = !!this.state.reason;
        return hasResources && hasReason;
    },

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm(this.state.identity, this.state.resources, this.state.reason);
    },

    handleIdentityChange: function(e) {
        this.setState({
            identity: Number(e.target.value)
        });
    },

    handleResourcesChange: function(e) {
        this.setState({
            resources: e.target.value
        });
    },

    handleReasonChange: function(e) {
        this.setState({
            reason: e.target.value
        });
    },

    renderAllocationSourceText: function() {
        return (
        <div>
            <p>
                If you are requesting for an Allocation Source please include the following information below.
            </p>
            <ol>
                <li>
                    What Allocation Source
                </li>
                <li>
                    How much you are requesting
                </li>
                <li>
                    The reason you need more
                </li>
            </ol>
        </div>
        )
    },

    renderAUCalculator: function() {
        return (<AUCalculator identity={this.state.identity} />);
    },

    renderIdentity: function(identity) {
        return (
        <option key={identity.id} value={identity.id}>
            {identity.get("provider").name}
        </option>
        )
    },

    renderBody: function() {
        var identities = stores.IdentityStore.getAll(),
            selectedIdentity = this.state.identity,

            // Hack: We have to call this method to populate the request
            // store. When this modal is submitted (see the call to onConfirm
            // above), a single resource request gets posted. When the
            // callback succeeds, the new request is added to the store. If
            // the store is not populated (models is null), then adding fails.
            requests = stores.ResourceRequestStore.getAll();

        let isLoading =
            [identities, selectedIdentity, requests]
            .some(item => !item) // Check if some are falsy

        if (isLoading) {
            return <div className="loading" />;
        }

        return (
        <div role="form">
            <div className="form-group">
                <label htmlFor="project-identity">
                    {"What cloud would you like resources for?"}
                </label>
                <select value={selectedIdentity} className="form-control" onChange={this.handleIdentityChange}>
                    {identities.map(this.renderIdentity)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="project-name">
                    {"What resources would you like to request?"}
                </label>
                {globals.USE_ALLOCATION_SOURCE
                 ? this.renderAllocationSourceText()
                 : ""}
                <textarea type="text"
                    className="form-control"
                    rows="7"
                    placeholder="E.g 4 CPUs and 8GB memory, running 4 cores for 1 week, an additional 500 AU, etc."
                    value={this.state.resources}
                    onChange={this.handleResourcesChange} />
            </div>
            {globals.USE_ALLOCATION_SOURCE
             ? this.renderAUCalculator()
             : ""}
            <div className="form-group">
                <label htmlFor="project-description">
                    {"How will you use the additional resources?"}
                </label>
                <textarea type="text"
                    className="form-control"
                    rows="7"
                    placeholder="E.g. To run a program or analysis, store larger output, etc."
                    value={this.state.reason}
                    onChange={this.handleReasonChange} />
            </div>
        </div>
        );
    },

    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Request Resources</h1>
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
                        <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            disabled={!this.isSubmittable()}
                            label="Request Resources"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
