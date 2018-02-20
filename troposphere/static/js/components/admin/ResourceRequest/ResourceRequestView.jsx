import React from "react";
import moment from "moment";

import globals from "globals";
import AllocationSourceView from "./AllocationSourceView";
import IdentityView from "./IdentityView";
import ModalHelpers from "components/modals/ModalHelpers";
import ConfirmApproveModal from "./ConfirmApproveModal";


// This is the view for the admin Resource Requests panel. This view shouldn't
// fetch or retrieve any data, just renders props.
export default React.createClass({

    propTypes: {
        request: React.PropTypes.object.isRequired,
        resourcesChanged: React.PropTypes.bool.isRequired,
        allocationSources: React.PropTypes.object,
        identities: React.PropTypes.object,
        onApprove: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,
        onDeny: React.PropTypes.func.isRequired,
        onAllocationSave: React.PropTypes.func.isRequired,
        onIdentitySave: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            denyReason: "",
            allowUpdatesToResolvedRequests: false
        };
    },

    componentWillReceiveProps(props) {
        if (this.props.request.id !== props.request.id) {

            // If we're viewing a new request, reset the state
            this.setState({
                allowUpdatesToResolvedRequests: false,
                denyReason: ""
            });
        }
    },

    handleResponseChange({ target: { value: denyReason } }) {
        this.setState({ denyReason });
    },

    style() {
        return {
            horizontalRule: {
                margin: "30px 0px"
            },
            section: {
                marginBottom: "20px",
                marginLeft: "10px",
                flexGrow: 1
            },
            container: {
                paddingLeft: "2em",
                flexGrow: 1
            }
        }
    },

    onApprove() {
        let { resourcesChanged, onApprove } = this.props;
        if (resourcesChanged) {
            onApprove();
        } else {
            // Confirm first that the user want to approve a request when
            // resources haven't changed
            ModalHelpers.renderModal(
                ConfirmApproveModal,
                { onApprove }
            );
        }
    },

    renderAllocationsSection() {
        let { allocationSources, onAllocationSave } = this.props;
        let { section } = this.style();

        let body = <p>There are no allocations</p>;
        if (allocationSources) {
            body = allocationSources.map(allocationSource => {
                let id = allocationSource.get("id");
                let props = {
                    onSave: onAllocationSave,
                    allocationSource,
                }
                return <AllocationSourceView key={id} { ...props }/>;
            })
        }

        return (
        <div style={section}>
            { body }
        </div>
        );
    },

    renderIdentitiesSection() {
        let { identities, onIdentitySave: onSave } = this.props;
        let { section } = this.style();

        // Filter identities to only include active identities
        if (identities) {
            identities = identities.filter(i => i.get("provider").active);
        }

        // Before identities load, render empty string
        let body = "";
        if (identities && identities.length === 0) {
            body = <p>This user doesn't have access to any active providers</p>;
        } else if (identities) {
            body = identities.map(identity => {
                let id = identity.get("id");
                let props = {
                    identity,
                    onSave,
                }
                return (
                <div key={id} style={{ marginBottom: "10px" }}>
                    <IdentityView { ...props}/>
                </div>
                )
            });
        }

        return (
        <div style={section}>
            { body }
            <div style={{ clear: "both" }} />
        </div>
        );
    },

    renderEditViewInOverlay() {
        let hideOverlay = () => this.setState({ allowUpdatesToResolvedRequests: true });

        // Render an overlay, to show that you likely do not want to
        // be editing a resource request that was already processed
        return (
        <div>
            <p>This request is no longer pending. <a onClick={hideOverlay}>Edit anyway</a>.</p>
            <div style={{ position: "relative", opacity: 0.5 }}>
                { this.renderEditView() }
                <div style={{ position: "absolute", width: "100%", height: "100%", top: 0 }} />
            </div>
        </div>
        );
    },

    renderEditView() {
        let { section } = this.style();
        let { denyReason } = this.state;

        return (
        <div>
            <h4 className="t-title">1. Update the user's current resources</h4>
            <div style={section}>
                { globals.EXTERNAL_ALLOCATION ? null : <h5 className="t-title">Allocation</h5> }
                { globals.EXTERNAL_ALLOCATION ? null : this.renderAllocationsSection() }
                <h5 className="t-title">Quota</h5>
                { this.renderIdentitiesSection() }
            </div>
            <h4 className="t-title">2. Approve/Deny/Close the request</h4>
            <div style={section}>
                <p>
                    On approve or deny, the user will be notified by email and
                    encouraged to reach out to support if they have questions.
                    Under <a href="//application/my-requests/resources">my
                    requests</a>, users can track the status of each request.
                </p>
                <p>
                    On close, the user will not be notified
                </p>
                <div style={{ display: "flex" }}>
                    <div style={{ padding: "20px", borderRight: "solid 1px #eee" }} >
                        <button onClick={this.onApprove}
                            type="button"
                            className="btn btn-default btn-sm">
                            Approve
                        </button>
                    </div>
                    <div style={{ padding: "20px", borderRight: "solid 1px #eee" }}>
                        <span style={{ paddingRight: "10px" }}>Provide a reason: <input onChange={this.handleResponseChange} value={ denyReason } /></span>
                        <button onClick={() => this.props.onDeny(denyReason)}
                            disabled={ denyReason == "" }
                            type="button"
                            className="btn btn-default btn-sm">
                            Deny
                        </button>
                    </div>
                    <div style={{ padding: "20px" }}>
                        <button onClick={this.props.onClose}
                            type="button"
                            className="btn btn-default btn-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    },

    renderCreatedDate(startDate) {
        let m = moment(startDate);
        return (
        <p>
        { m.format("MMM Do YYYY") } ({ m.fromNow() })
        </p>
        );
    },

    render() {
        let {
            created_by: { username },
            status,
            request,
            description,
            start_date,
        } = this.props.request.toJSON();
        let {
            container, section, horizontalRule
        } = this.style();
        let {
            allowUpdatesToResolvedRequests
        } = this.state;

        let allowEdits = status.name == "pending" || allowUpdatesToResolvedRequests;

        return (
        <div style={container}>
            <h4 className="t-title">User</h4>
            <div style={section}>
                <p>{username}</p>
            </div>
            <h4 className="t-title">Request</h4>
            <div style={section}>
                <p>{request}</p>
            </div>
            <h4 className="t-title">Description</h4>
            <div style={section}>
                <p>{description}</p>
            </div>
            <h4 className="t-title">Status</h4>
            <div style={section}>
                <p>{status.name}</p>
            </div>
            <h4 className="t-title">Created</h4>
            <div style={section}>
                { this.renderCreatedDate(start_date) }
            </div>
            <hr style={horizontalRule} />
            { allowEdits ? this.renderEditView() : this.renderEditViewInOverlay() }
        </div>
        );
    }
});
