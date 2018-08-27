import React from "react";
import {RaisedButton, CircularProgress} from "material-ui";
import WarningIcon from "material-ui/svg-icons/alert/warning";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import actions from "actions";
import CopyButton from "components/common/ui/CopyButton";

export default React.createClass({
    mixins: [BootstrapModalMixin],

    getInitialState() {
        return {
            errorMsg: "",
            name: "",
            hash: "",
            successView: false,
            isSubmitting: false
        };
    },

    updateName(e) {
        this.setState({
            name: e.target.value
        });
    },

    onSubmit() {
        const {name} = this.state;
        this.setState({
            isSubmitting: true
        });
        let promise = actions.APITokenActions.create(name.trim());
        promise.then(this.onSuccess);
        promise.catch(this.onError);
    },

    onSuccess(response) {
        this.setState({
            isSubmitting: false,
            successView: true,
            hash: response.token
        });
    },

    onError(response) {
        this.hide();
    },

    renderFormView() {
        return (
            <div>
                <p>
                    Give your Access Token a name to help you remember where you
                    are using it. After you create your token you will only have
                    one chance to copy it somewhere safe.
                </p>
                <div className="form-group">
                    <label className="control-label">Name</label>
                    <div>
                        <input
                            type="text"
                            placeholder="My Token Name"
                            className="form-control"
                            onChange={this.updateName}
                            value={this.state.name}
                        />
                        * Name Required
                    </div>
                </div>
            </div>
        );
    },

    successStyles() {
        return {
            infoBlock: {display: "flex", marginBottom: "16px"},
            infoBlockIcon: {marginRight: "16px", flex: "1 0 24px"},
            figureCaption: {fontWeight: "600"},
            figureBody: {
                borderRadius: "4px",
                border: "solid rgba(0,0,0,.3) 1px",
                padding: "8px",
                fontSize: "16px",
                fontFamily: "monospace"
            }
        };
    },

    renderSuccessView() {
        const {name, hash} = this.state;
        const styles = this.successStyles();
        return (
            <div>
                <h2
                    style={{marginBottom: "24px"}}
                    className="t-title">{`Token "${name}" Created Successfully!`}</h2>
                <div style={styles.infoBlock}>
                    <WarningIcon style={styles.infoBlockIcon} />
                    <p>
                        Make sure you copy this token now. You will not have
                        another chance after this modal is closed!
                    </p>
                </div>
                <figure>
                    <figcaption style={styles.figureCaption}>
                        Your Public Access Token
                    </figcaption>
                    <div style={styles.figureBody}>
                        {hash}
                        <CopyButton text={hash} />
                    </div>
                </figure>
            </div>
        );
    },

    renderSubmitButton() {
        if (this.state.successView) {
            return (
                <RaisedButton
                    primary
                    onClick={this.hide}
                    label="Back to Settings"
                />
            );
        } else if (this.state.isSubmitting) {
            return (
                <RaisedButton
                    primary
                    disabled
                    icon={<CircularProgress size={24} color="rgba(0,0,0,.3)" />}
                    label="creating..."
                />
            );
        } else {
            return (
                <RaisedButton
                    primary
                    disabled={!this.state.name}
                    onClick={this.onSubmit}
                    label="Create Token"
                />
            );
        }
    },

    render() {
        const {successView, isSubmitting} = this.state;

        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton}
                            <h1 className="t-title">
                                Create Personal Access Token
                            </h1>
                        </div>
                        <div
                            style={{minHeight: "300px"}}
                            className="modal-body">
                            {successView
                                ? this.renderSuccessView()
                                : this.renderFormView()}
                        </div>
                        <div className="modal-footer">
                            {successView || isSubmitting ? null : (
                                <RaisedButton
                                    style={{marginRight: "16px"}}
                                    onClick={this.hide}
                                    label="Cancel"
                                />
                            )}
                            {this.renderSubmitButton()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
