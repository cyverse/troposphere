import React from "react";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon"

import stores from "stores";

export default React.createClass({
    displayName: "RequestMoreQuotaOrAllocationModal",

    mixins: [BootstrapModalMixin],

    getInitialState() {
        return {
            view: null,
            nextView: null,
            resources: "",
            reason: ""
        }
    },

    updateState() {
        if (!this.state.view) {
            this.setState({
                view: "INITIAL_VIEW",
            });
        }
    },

    componentDidMount: function() {
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.ResourceRequestStore.addChangeListener(this.updateState);
        // prime the data pump
        this.updateState();
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

    hasNextSelected() {
        return!!this.state.nextView;
    },

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm(this.state.resources, this.state.reason);
    },

    viewInitial() {
        this.setState({
            view: "INITIAL_VIEW"
        });
    },

    viewAskForMoreQuota() {
        this.setState({
            view: "MORE_QUOTA_VIEW"
        });
    },

    viewAskForMoreAllocation() {
        this.setState({
            view: "MORE_ALLOCATION_VIEW"
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

    updateSelect(event) {
        let nextView = event.target.value;
        this.setState({ nextView });
    },

    selectOption() {
        let { nextView } = this.state;
        this.setState({ view: nextView })
    },

    headerTitle() {
        let { view } = this.state;
        switch (view) {
            case "MORE_QUOTA_VIEW":
                return "Request Larger Quota";
            case "MORE_ALLOCATION_VIEW":
                return "Allocation Request Information";
            case "INITIAL_VIEW":
                return "Select resource request type";
        }
    },

    renderSelectRequestType() {
        let divStyle = {
                padding: "5px 0px 5px 25px",
            };
        return (
        <div role="form">
            <div>
                <div style={{ fontSize: "18px", fontWeight: 500, marginBottom: "10px" }}>
                    There are two types of resource requests that can be made:
                </div>
                <ol>
                    <li><strong>Increase Jetstream quota</strong>
                        <ul>
                            <li>
                                Quota controls the amount of resources (CPU, RAM, etc) that can be used at a given time.
                                The end result would be that you can launch more instances, or larger instances.
                            </li>
                        </ul>
                    </li>
                    <li><strong>Increase XSEDE allocation</strong>
                        <ul>
                            <li>
                                Allocation controls the use of resources, over time. This means that you can use instances, for example, for a longer period of time.
                            </li>
                        </ul>
                    </li>
                </ol>
            </div>
            <div key="resource-question-radio-grp"
                 className="form-group">
                <div style={{ fontSize: "18px", fontWeight: 500, marginBottom: "10px" }}>
                    {"What type of request do you need to make?"}
                </div>
                <div key="check-quota"
                     className="form-check"
                     style={divStyle}>
                    <label className="form-check-label">
                        <input key="check-quota-input"
                               id="check-quota-input-id"
                               name="identities"
                               type="radio"
                               className="form-check-input"
                               value="MORE_QUOTA_VIEW"
                               onChange={this.updateSelect} />
                        <span style={{ paddingLeft: "5px"}}>
                        {"Request more CPU or RAM"}
                        </span>
                    </label>
                </div>
                <div key="check-allocation"
                     className="form-check"
                     style={divStyle}>
                    <label className="form-check-label">
                        <input key="check-allocation-input"
                               id="check-allocation-input-id"
                               name="identities"
                               type="radio"
                               className="form-check-input"
                               value="MORE_ALLOCATION_VIEW"
                               onChange={this.updateSelect} />
                        <span style={{ paddingLeft: "5px"}}>
                        {"Request a supplemental allocation"}
                        </span>
                    </label>
                </div>
            </div>
        </div>
        );
    },

    renderMoreQuota() {
        return (
        <div role="form">
            <div className="form-group">
                <label htmlFor="project-name">
                    {"What resources would you like to request?"}
                </label>
                <textarea type="text"
                          className="form-control"
                          rows="7"
                          placeholder="E.g 4 CPUs and 8GB memory, running 12 cores for 1 week, etc."
                          value={this.state.resources}
                          onChange={this.handleResourcesChange} />
            </div>
            <div className="form-group">
                <label htmlFor="project-description">
                    {"How will you use the additional quota?"}
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

    renderMoreAllocation() {
        return (
        <div>
            <div style={{ fontSize: "18px", fontWeight: 500, marginBottom: "10px" }}>
                XSEDE Allocations:
            </div>
            <div style={{ marginBottom: "10px" }}>
                Requesting a supplemental allocation must be done through the <a href="https://portal.xsede.org/">XSEDE User Portal (XUP)</a>.
            </div>
            <div>
                Instructions for how to submit a request can be found in the
                XSEDE Knowledge Base:
                <ul style={{ padding: "5px" }}>
                    <li>
                        <a href="https://portal.xsede.org/knowledge-base/-/kb/document/axwu"
                           target="_blank">
                            How do I request supplemental service units for an XSEDE allocation?
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        );
    },

    renderBody() {
        let { view } = this.state;
        switch (view) {
            case "MORE_QUOTA_VIEW":
                return this.renderMoreQuota()
            case "MORE_ALLOCATION_VIEW":
                return this.renderMoreAllocation()
            case "INITIAL_VIEW":
                return this.renderSelectRequestType()
        }
    },

    renderFooter() {
        let { view } = this.state;

        if (view === "INITIAL_VIEW") {
            return (
            <div className="modal-footer">
                <button type="button"
                        className="btn btn-default"
                        onClick={this.cancel}>
                    Cancel
                </button>
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.selectOption}
                        disabled={!this.hasNextSelected()}>
                    Next
                </button>
            </div>
            );

        } else if (view === "MORE_QUOTA_VIEW") {
            return (
            <div className="modal-footer">
                <button type="button"
                        className="btn btn-default pull-left"
                        style={{ marginRight: "10px" }}
                        onClick={this.viewInitial}>
                    <Glyphicon name="arrow-left" />
                    {` Back`}
                </button>
                <button type="button"
                        className="btn btn-default"
                        onClick={this.cancel}>
                    Cancel
                </button>
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.confirm}
                        disabled={!this.isSubmittable()}>
                    Complete Request
                </button>
            </div>
            );
        } else if (view === "MORE_ALLOCATION_VIEW") {
            return (
            <div className="modal-footer">
                <button type="button"
                        className="btn btn-default pull-left"
                        style={{ marginRight: "10px" }}
                        onClick={this.viewInitial}>
                    <Glyphicon name="arrow-left" />
                    {` Back`}
                </button>
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.cancel}
                        disabled={!this.hasNextSelected()}>
                    Okay
                </button>
            </div>
            );
        } else {
            return (
            <div className="modal-footer">
                <button type="button"
                        className="btn btn-default"
                        onClick={this.cancel}>
                    Cancel
                </button>
            </div>
            );
        }
    },

    render() {
        return (
        <div className="modal fade">
            <div className="modal-dialog" style={{ width: "100%", maxWidth: "650px" }}>
                <div className="modal-content">
                    <div className="modal-header instance-launch">
                        { this.renderCloseButton() }
                        <h1 className="t-title">{ this.headerTitle() }</h1>
                    </div>
                    <div className="modal-body">
                        { this.renderBody() }
                    </div>
                    { this.renderFooter() }
                </div>
            </div>
        </div>
        );
    }
});
