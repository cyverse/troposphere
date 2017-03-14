import _ from "underscore";
import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";
import { trackAction } from "../../../utilities/userActivity";

export default React.createClass({
    displayName: "VolumeReportModal",

    mixins: [BootstrapModalMixin],

    getInitialState: function() {
        return {
            attach: false,
            mount: false,
            data: false,
            transfer: false,
            other: false,
            details: ""
        };
    },

    isSubmittable: function() {
        var hasDetails = !!this.state.details && this.state.details.length > 0;
        return hasDetails;
    },

    getReportInfo: function() {
        var problemKeys = _.keys(
            _.object(
                _.filter(
                    _.pairs(this.state), function(pair) {
                        return pair[1] === true;
                    }
                )
            )
        );
        var problems = _.values(
            _.pick(this.problemText, problemKeys)
        );

        var reportInfo = {
            problems: problems,
            details: this.state.details
        };

        return reportInfo;
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
        var reportInfo = this.getReportInfo();
        this.props.onConfirm(reportInfo);
        trackAction("reported-volume", {});
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    updateCheckbox: function(key, e) {
        var state = {};
        state[key] = e.target.checked;
        this.setState(state);
    },

    handleDetailsChange: function(e) {
        this.setState({
            details: e.target.value
        });
    },

    //
    // Render
    // ------
    //

    problemText: {
        attach: "Volume does not successfully attach or detach",
        mount: "Volume does not successfully mount or unmount",
        data: "Data is missing from my volume",
        transfer: "Cannot transfer data on/off my volume",
        other: "Other problem(s)"
    },

    renderCheckbox: function(value) {
        var onChange = _.partial(this.updateCheckbox, value);

        return (
        <div className="checkbox">
            <label>
                <input type="checkbox"
                    name="problems"
                    id={"problems-" + value}
                    value={value}
                    checked={this.state[value]}
                    onChange={onChange} />
                {this.problemText[value]}
            </label>
        </div>
        );
    },

    renderIntroduction: function(volume) {
        return (
        <p className="alert alert-info">
            <Glyphicon name="info-sign" />
            {" Is the volume "}
            <code>{volume.get("name")}</code>
            {" exhibiting unexpected behavior? First, it may help to read about "}
            <a href={this.props.helpLink.get("href")}>using volumes</a>
            {" and "}
            <a href={this.props.troubleshooting.get("href")}>troubleshooting volumes</a>
            {"."}
        </p>
        );
    },

    renderBody: function() {
        var volume = this.props.volume;

        return (
        <div>
            {this.renderIntroduction(volume)}
            <div role="form">
                <div className="form-group">
                    <label>
                        {"What problems are you having with this volume?"}
                    </label>
                    {this.renderCheckbox("attach")}
                    {this.renderCheckbox("mount")}
                    {this.renderCheckbox("data")}
                    {this.renderCheckbox("transfer")}
                    {this.renderCheckbox("other")}
                </div>
                <div className="form-group">
                    <label htmlFor="details">
                        Please provide as many details about the problem as possible.
                    </label>
                    <textarea className="form-control" onChange={this.handleDetailsChange} rows="6" />
                </div>
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
                        <strong>Report Volume</strong>
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
                            onTouchTap={this.confirm}
                            disabled={!this.isSubmittable()}
                            label="Report Volume"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
