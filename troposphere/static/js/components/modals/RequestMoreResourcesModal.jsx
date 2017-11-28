import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import stores from "stores";

export default React.createClass({
    displayName: "RequestMoreResourcesModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        onConfirm: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            resources: "",
            reason: ""
        };
    },

    updateState: function() {
        this.forceUpdate()
    },

    componentDidMount: function() {
        stores.ResourceRequestStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
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
        this.props.onConfirm(this.state.resources, this.state.reason);
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

    renderBody: function() {
        return (
        <div role="form">
            <div className="form-group">
                <label htmlFor="project-name">
                    {"What resources would you like to request?"}
                </label>
                <textarea type="text"
                    className="form-control"
                    rows="7"
                    placeholder="E.g 4 CPUs and 8GB memory, running 4 cores for 1 week, an additional 500 AU, etc."
                    value={this.state.resources}
                    onChange={this.handleResourcesChange} />
            </div>
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
