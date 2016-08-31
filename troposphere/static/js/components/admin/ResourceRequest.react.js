import React from "react";
import Router, { RouteHandler } from "react-router";
import stores from "stores";
import Tooltip from "react-tooltip";
import _ from "underscore";

import RouterInstance from "../../Router";
import ResourceActions from "actions/ResourceActions";
import Quota from "models/Quota";
import Allocation from "models/Allocation";


export const ResourceRequestView = React.createClass({

    propTypes: {
        requestId: React.PropTypes.number.isRequired,
        username: React.PropTypes.string.isRequired,
        request: React.PropTypes.string.isRequired,
        description: React.PropTypes.string.isRequired,
        allocation: React.PropTypes.object.isRequired,
        quota: React.PropTypes.object.isRequired,
        onApprove: React.PropTypes.func.isRequired,
        onDeny: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return this.getStateFromProps(this.props);
    },

    componentWillReceiveProps(newProps) {
        // If a new request is present
        if (newProps.requestId != this.props.requestId) {
            this.setState(this.getStateFromProps(newProps));
        }
    },

    getStateFromProps(props) {
        let { quota, allocation } = props;

        // Why is this here?
        //
        // if you need to setState based on a prop, it must be done in
        // getInitialState /AND/ in componentWillReceiveProps:
        //
        //      getInitialState uses this.props
        //      componentWillReceiveProps uses props
        //
        // getStateFromProps(props) unifies both interfaces
        //

        let expires = allocation.get("delta") != -1;
        let threshold = allocation.get("threshold") / 60;

        // Source input fields from the request's quota
        // ex. { floating_ip: 5, cpus: 4, ... }
        let quotaDefaults = quota.pick(this.getQuotaFields());

        return {
            response: "",

            // Quota field state
            ...quotaDefaults,

            // Allocation field state
            threshold,
            expires,
        };
    },

    // Quota fields that the view knows how to render
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

    canSubmit() {
        let response = this.state.response;
        return response &&
        response.trim().length > 0;
    },

    handleResponseChange(e) {
        this.setState({
            response: e.target.value
        });
    },

    onThresholdChange(e) {
        this.setState({
            threshold: Number(e.target.value)
        });
    },

    onExpiresChange(expires) {
        this.setState({
            expires
        });
    },

    renderAllocationFields() {
        // Note: with regards to rendering:
        // thresholdAU can be undefined, which will render an empty input
        let threshold = this.state.threshold;
        let expires = this.state.expires;

        return (
        <div>
            <Label htmlFor="au">
                Compute time (AU):
                <QuestionMark tip={"Total compute time, each active cpu uses 1 AU/hr"} />
            </Label>
            <input id="au"
                className="form-control"
                type="number"
                value={threshold}
                onChange={this.onThresholdChange} />
            <Label htmlFor="expire">
                Monthly expiration:
            </Label>
            <div id="expire">
                <input id="expire-enabled"
                    type="radio"
                    checked={expires}
                    onChange={this.onExpiresChange.bind(this, true)} />
                <Label htmlFor="expire-enabled">
                    Yes
                </Label>
                <input id="expire-disabled"
                    type="radio"
                    name="expire"
                    checked={!expires}
                    onChange={this.onExpiresChange.bind(this, false)} />
                <Label htmlFor="expire-disabled">
                    No
                </Label>
            </div>
        </div>
        );
    },

    onDeny() {
        this.props.onDeny(
            this.state,
        );
    },

    onApprove() {
        this.props.onApprove(
            this.state,
        );
    },

    renderQuotaFields() {

        // [ "cpu", "memory", "storage", ...]
        return this.getQuotaFields().map((field, i) => {

            // Value of user's input for cpu (Ex. 16)
            let value = this.state[field];

            // Label for cpu quota (Ex. "CPU:")
            let label = this.quotaData[field].label;

            // Tip for cpu quota (Ex. "Total cpus across instances")
            let tip = this.quotaData[field].tip;

            return (
            <span key={i} dataToggle="tooltip"><Label htmlFor={field}> {label} <QuestionMark tip={tip}/> </Label> <input className="form-control"
                                                                                                                                                                                   type="number"
                                                                                                                                                                                   value={value}
                                                                                                                                                                                   onChange={(e) => this.handleQuotaChange.call(this, e, field)} /></span>
            );
        });
    },

    // field is one of [ "cpu", "memory", "storage", ...]
    handleQuotaChange(e, field) {
        let obj = {};

        // Coerce the quota values to numbers
        obj[field] = Number(e.target.value);
        this.setState(obj);
    },

    style() {
        return {
            horizontalRule: {
                margin: "10px 0px",
            },
            quotaDiv: {
                width: "47.5%",
                marginRight: "2.5%",
                float: "left"
            },
            allocationDiv: {
                width: "47.5%",
                marginLeft: "2.5%",
                float: "right"
            },
            responseArea: {
                resize: "vertical"
            }
        }
    },

    render() {
        let { username, request, description } = this.props;

        return (
        <div className="admin-detail">
            <div className="request-info">
                <h4>User:</h4>
                <div style={{ padding: "10px" }}>
                    {username}
                </div>
                <h4>Request:</h4>
                <div style={{ padding: "10px" }}>
                    {request}
                </div>
                <h4>Description:</h4>
                <div style={{ padding: "10px" }}>
                    {description}
                </div>
            </div>
            <hr style={this.style().horizontalRule} />
            <div style={this.style().quotaDiv}>
                <h4>Quota:</h4>
                {this.renderQuotaFields()}
            </div>
            <div style={this.style().allocationDiv}>
                <h4>Allocation:</h4>
                {this.renderAllocationFields()}
            </div>
            <div style={{ clear: "both" }}></div>
            <hr style={this.style().horizontalRule} />
            <div className="form-group">
                <h4>Response:</h4>
                <textarea style={this.style().responseArea}
                    className="form-control"
                    type="text"
                    form="admin"
                    value={this.state.response}
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

const Label = React.createClass({
    render() {
        let style = Object.assign({
            margin: "7px 0px",
        }, this.props.style);

        let props = Object.assign({}, this.props, {
            style
        });

        return (
        <label { ...props }></label>
        );
    }
});

const QuestionMark = React.createClass({
    getInitialState() {
        return {
            opacity: "0.4",
        };
    },
    onMouseOver() {
        this.setState({
            opacity: "1"
        });
    },
    onMouseOut() {
        this.setState(this.getInitialState());
    },
    render() {
        let opacity = this.props.tip ? this.state.opacity : "0";
        let rand = Math.random() + "";
        return (
        <span><span onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                  style={{ opacity }}
                  data-tip={this.props.tip}
                  data-for={rand}
                  className="glyphicon glyphicon-question-sign"
                  aria-hidden="true"></span>
        <Tooltip id={rand} place="right" effect="solid" />
        </span>
        );
    }
});

// This component is responsible for interfacing with our stores, and
// fetching/aggregating data. It does the dirty work for the
// ResourceRequestView.
export default React.createClass({
    mixins: [Router.State],

    componentDidMount() {
        stores.ResourceRequestStore.addChangeListener(this.updateState);
        stores.StatusStore.addChangeListener(this.updateState);
        stores.AllocationStore.addChangeListener(this.updateState);
        stores.QuotaStore.addChangeListener(this.updateState);
    },
    componentWillUnmount() {
        stores.ResourceRequestStore.removeChangeListener(this.updateState);
        stores.StatusStore.removeChangeListener(this.updateState);
        stores.AllocationStore.removeChangeListener(this.updateState);
        stores.QuotaStore.removeChangeListener(this.updateState);
    },

    updateState() {
        // If new models come along trigger a re-render
        this.forceUpdate();
    },

    onApprove(view) {
        let { allocation, quota, statuses, request } = this.fetch();

        let response = view.response;
        let allocExists = this.allocationCreatedForView(allocation, view);
        let quotaExists = this.quotaCreatedForView(quota, view);

        if (!quotaExists) {
            quota = new Quota(_.pick(view, this.quotaFields));
        }

        if (!allocExists) {
            let delta = view.expires ? 525600 : -1;
            let threshold = view.threshold * 60;
            allocation = new Allocation({
                delta,
                threshold
            })
        }

        let status = statuses.findWhere({
            name: "approved"
        });

        ResourceActions.approve({
            request,
            response,
            quota,
            allocation,
            status
        }).then(() => {
            RouterInstance.getInstance().transitionTo("resource-request-manager");
        });
    },

    onDeny(view) {
        let { statuses, request } = this.fetch();

        let response = view.response;

        let status = statuses.findWhere({
            name: "denied"
        });

        ResourceActions.deny({
            request,
            response,
            status,
        }).then(() => {
            RouterInstance.getInstance().transitionTo("resource-request-manager");
        });
    },

    quotaFields: [
        "cpu",
        "memory",
        "storage",
        "storage_count",
        "snapshot_count",
        "instance_count",
        "port_count",
        "floating_ip_count"
    ],

    allocationCreatedForView(allocation, view) {
        // Make a comment here how the view hides this ugliness
        let viewDelta = view.expires ? 525600 : -1;
        let viewThreshold = view.threshold * 60;

        return allocation.get("threshold") == viewThreshold &&
        allocation.get("delta") == viewDelta;
    },

    quotaCreatedForView(quota, view) {
        return this.quotaFields.every((f) => {
            return quota.get(f) == view[f];
        })
    },

    fetch() {
        let requestId = Number(this.props.params.id);
        let allocation,
            quota,
            statuses,
            request,
            requests;

        statuses = stores.StatusStore.getAll();
        requests = stores.ResourceRequestStore.findWhere({
            "status.name": "pending"
        });

        if (requests) {
            // Find a pending request with the matching id
            request = requests.findWhere({
                id: requestId
            })

            if (request) {
                // Fetch allocation
                let allocationId = request.get("current_allocation");
                allocation = stores.AllocationStore.get(allocationId);

                // Fetch quota
                let quotaId = request.get("current_quota");
                quota = stores.QuotaStore.get(quotaId);
            }
        }

        return {
            allocation,
            quota,
            statuses,
            request,
            requests
        };
    },

    render() {
        let { allocation, quota, request, requests } = this.fetch();


        // If resources are not loading /and/ the ResourceRequest is falsy,
        // then the request doesn't exist, the user has ended up at a bad url
        // and should be notified
        if (requests && !request) {
            return (
            <div className="request-admin pull-right">
                <p>
                    The request does not exist
                </p>
            </div>
            );

        // Otherwise wait for the props necessary for the view
        } else if (!(request && allocation && quota)) {
            return <div className="loading" />;
        }

        return (
        <div className="request-admin pull-right">
            <ResourceRequestView {...{ requestId: Number(this.props.params.id), username: request.get( "user").username, request: request.get( "request"), description: request.get(
                "description"), allocation, quota, quotaFields: this.quotaFields, onApprove: this.onApprove, onDeny: this.onDeny, }} />
            <RouteHandler />
        </div>
        );
    }
});
