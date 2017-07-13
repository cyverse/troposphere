import React from "react";
import _ from "underscore";

import AllocationSourcesView from "./AllocationSourcesView";
import QuotaView from "./QuotaView";
import GlyphiconTooltip from 'components/common/ui/GlyphiconTooltip';

// This is the view for the admin Resource Requests panel. This view shouldn't
// fetch or retrieve any data, just renders props.
export default React.createClass({

    propTypes: {
        request: React.PropTypes.object.isRequired,
        allocationSources: React.PropTypes.array.isRequired,
        quota: React.PropTypes.object.isRequired,
        onApprove: React.PropTypes.func.isRequired,
        onDeny: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return this.getStateFromProps(this.props);
    },
    quotaData: {
        "cpu": {
            label: "CPU:",
            tip: "Total cpus across instances"
        },
        "memory": {
            label: "Memory (GB):",
            tip: "Total memory across instances"
        },
        "storage": {
            label: "Storage (GB):",
            tip: "Total disk space across instances"
        },
        "storage_count": {
            label: "Volumes:",
            tip: "Total number of volumes"
        },
        "snapshot_count": {
            label: "Snapshots:",
            tip: "Total number of instance snapshots"
        },
        "instance_count": {
            label: "Instances:",
            tip: "Total number of instances"
        },
        "port_count": {
            label: "Fixed IPs:",
            tip: ""
        },
        "floating_ip_count": {
            label: "Floating IPs:",
            tip: ""
        },
    },
    getQuotaFields() {
        // Returns:
        // [
        //     "cpu",
        //     "instance_count",
        //     "floating_ip_count"
        //     ...
        //  ]
        return Object.keys(this.quotaData);
    },

    componentWillReceiveProps(newProps) {
        // If a new request is present
        if (newProps.request.id != this.props.request.id) {
            this.setState(this.getStateFromProps(newProps));
        }
    },

    getStateFromProps(props) {
        let { quota, allocationSources } = props;
        return {
            response: "",
            quota,
            allocationSources
        };
    },

    canSubmit() {
        let response = this.state.response;
        return response && response.trim().length > 0;
    },

    handleResponseChange(e) {
        this.setState({
            response: e.target.value
        });
    },

    onAllocationChange({ id, compute_allowed }) {
        let allocationSources = this.state.allocationSources.map(as => {
            if (as.id === id) {
                return Object.assign({}, as, { id, compute_allowed });
            }
            return as;
        });
        this.setState({ allocationSources });
    },

    onQuotaChange(quota) {
        this.setState({ quota });
    },

    onDeny() {
        let { response, quota, allocationSources } = this.state;
        this.props.onDeny({
            response, quota, allocationSources
        });
    },

    onApprove() {
        let { response, quota, allocationSources } = this.state;

        this.props.onApprove({
            response, quota, allocationSources
        });
    },

    findQuotaForValues(current_quota) {
        /**
         * current_quota: Javascript _Object_ that has quotaValues currently assigned
         */
        let { QuotaStore } = this.props.subscriptions;
        let all_quotas = QuotaStore.getAll();
        if (!all_quotas) {
            return ;
        }
        var all_fields = this.getQuotaFields();
        let quota_matched = all_quotas.find(function(quota) {
            let matching_all_values = _.every(all_fields, (field, i) => {
                let value = current_quota[field]
                let quota_value = quota.get(field)
                return (quota_value == value)
            });
            return matching_all_values;
        });
        return quota_matched;
    },
    style() {
        return {
            horizontalRule: {
                margin: "10px 0px"
            },
            responseArea: {
                resize: "vertical",
                minHeight: "100px"
            },
            section: {
                paddingBottom: "10px",
                paddingLeft: "10px",
                flexGrow: 1
            },
            container: {
                paddingLeft: "2em",
                flexGrow: 1
            }
        }
    },
    renderNewQuotaIcon() {
        var current_quota = this.state["quota"];
        let quota_matched = this.findQuotaForValues(current_quota);
        if (quota_matched) {
            return (
                <GlyphiconTooltip glyphicon="ok-sign" tip="Use an existing quota" />
            );
        } else {
            return (
                <GlyphiconTooltip glyphicon="plus-sign" tip="Create a new quota" />
            );
        }
    },
    render() {
        let {
            created_by: { username },
            request, description
        } = this.props.request;
        let {
            container, section, horizontalRule, responseArea
        } = this.style();
        let {
            response, quota, allocationSources
        } = this.state;
        let { onQuotaChange, onAllocationChange } = this;

        return (
        <div style={container}>
            <div>
                <h4 className="t-title">User:</h4>
                <div style={section}>
                    <p>{username}</p>
                </div>
                <h4 className="t-title">Request:</h4>
                <div style={section}>
                    <p>{request}</p>
                </div>
                <h4 className="t-title">Description:</h4>
                <div style={section}>
                    <p>{description}</p>
                </div>
                <h4 className="t-title">Allocation:</h4>
                <div style={section}>
                <AllocationSourcesView { ...{ allocationSources, onAllocationChange }}/>
                </div>
                <h4 className="t-title">
                    Quota: { this.renderNewQuotaIcon() }
                </h4>
                <div style={section}>
                    <QuotaView { ...{ quota, onQuotaChange } }/>
                </div>
            </div>
            <div style={{ clear: "both" }} />
            <hr style={horizontalRule} />
            <div className="form-group">
                <h4 className="t-title">Response:</h4>
                <textarea style={responseArea}
                    className="form-control"
                    type="text"
                    form="admin"
                    value={response}
                    onChange={this.handleResponseChange}>
                </textarea>
            </div>
            <div className="buttons">
                <button disabled={!this.canSubmit()}
                    onClick={this.onApprove}
                    type="button"
                    className="btn btn-default btn-sm">
                    Approve
                </button>
                <button disabled={!this.canSubmit()}
                    onClick={this.onDeny}
                    type="button"
                    className="btn btn-default btn-sm">
                    Deny
                </button>
            </div>
        </div>
        );
    }
});
