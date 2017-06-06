import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import AUCalculator from "components/common/AUCalculator";
import stores from "stores";
import globals from "globals";

export default React.createClass({
    displayName: "RequestMoreResourcesModal",

    mixins: [BootstrapModalMixin],

    getInitialState: function() {
        var identities = stores.IdentityStore.getAll();
        return {
            identity: identities ? identities.first().id : null,
            resources: "",
            reason: ""
        };
    },

    getState: function() {
        var identities = stores.IdentityStore.getAll(),
            identityId = null;

        if (identities) {
            identityId = this.state.identity ? this.state.identity : identities.first().id;
        }

        return {
            identity: identityId
        }
    },

    updateState: function() {
        if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function() {
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.ResourceRequestStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.IdentityStore.removeChangeListener(this.updateState);
    },

    isSubmittable: function() {
        var hasResources = !!this.state.resources;
        var hasReason = !!this.state.reason;
        return hasResources && hasReason;
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm(this.state.identity, this.state.resources, this.state.reason);
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
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

    //
    // Render
    // ------
    //
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
            instances = stores.InstanceStore.getAll(),
            username = stores.ProfileStore.get().get("username"),
            requests = stores.ResourceRequestStore.findResourceRequestsWhere({
                "created_by.username": username
            });

        if (username == null || requests == null) {
            return <div className="loading"></div>;
        }

        if (!identities || !instances) return <div className="loading" />;

        return (
        <div role="form">
            <div className="form-group">
                <label htmlFor="project-identity">
                    {"What cloud would you like resources for?"}
                </label>
                <select className="form-control" onChange={this.handleIdentityChange}>
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
