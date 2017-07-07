import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import SelectMenu from "components/common/ui/SelectMenu";
import actions from "actions";

export default React.createClass({
    displayName: "ScriptCreateModal",

    mixins: [BootstrapModalMixin],

    getInitialState: function() {
        let script = this.props.script;
        if(! script) {
            return ({
                type: "URL",
                strategy: "always",
                title: "",
                text: "",
                validate: false
            })
        }
        return ({
            type: script.get('type'),
            strategy: script.get('strategy'),  //Temporary
            title: script.get('title'),
            text: script.get('text'),
            validate: false
        });
    },

    propTypes: {
        script: React.PropTypes.instanceOf(Backbone.Model),
    },

    onSaveScript: function() {
        if (!this.state.validate) {
            this.setState({
                validate: true
            });
        }
        if (this.isSubmittable) {
            let script = actions.ScriptActions.update(this.props.script, {
                type: this.state.type,
                strategy: this.state.strategy,
                title: this.state.title.trim(),
                text: this.state.text.trim()
            });
            // do action after save is completed?
            this.hide();
        }
    },
    onChangeStrategy: function(strategy) {
        this.setState({
            strategy
        })
    },

    onChangeType: function(type) {
        this.setState({
            type
        })
    },

    onChangeTitle: function(e) {
        let title = e.target.value;
        this.setState({
            title
        })
    },

    onBlurTitle: function() {
        let title = this.state.title.trim();
        this.setState({
            title
        });
    },

    onChangeText: function(e) {
        let text = e.target.value;
        this.setState({
            text
        })
    },

    onBlurText: function() {
        let text = this.state.text.trim();
        this.setState({
            text
        });
    },

    onCreateScript: function() {
        if (!this.state.validate) {
            this.setState({
                validate: true
            });
        }
        if (this.isSubmittable) {
            let script = actions.ScriptActions.create({
                type: this.state.type,
                title: this.state.title.trim(),
                text: this.state.text.trim(),
                strategy: this.state.strategy
            });
            this.hide();
        }
    },

    // A utility function testing for whitespace or empty string at the beginning or end of string.
    // There is probably a better place to put this.
    isValidString: function(str) {
        if (str !== "") {
            return true
        }
        return false
    },

    isValidUrl: function(str) {
        if (!(str.search("https?://") < 0)) {
            if (str.indexOf(" ") >= 0) {
                return false
            }
            return true
        }
        return false
    },

    isSubmittable: function() {
        let title = this.state.title;
        let text = this.state.text;

        if (this.isValidString(title) && this.isValidString(text)) {
            if (this.state.type === "URL") {
                if (!this.isValidUrl(text)) {
                    return false
                }
            }
            return true;
        }
        return false
    },

    renderInputType: function() {
        let text = this.state.text;
        let classNames = "form-group";
        let errorMessage = null;

        if (this.state.type === "URL") {
            if (this.state.validate) {
                if (!this.isValidUrl(text) || !this.isValidString(text)) {
                    classNames = "form-group has-error";
                    errorMessage = `URL must start with "https://" or "http://" and have no spaces`;
                }
            }

            return (
            <div className={classNames}>
                <label>
                    Script URL
                </label>
                <input className="form-control"
                    placeholder="http://yourscript.org"
                    value={this.state.text}
                    onInput={this.onChangeText}
                    onBlur={this.onBlurText} />
                <span className="help-block">{errorMessage}</span>
            </div>
            )
        } else {
            if (this.state.validate) {
                if (!this.isValidString(text)) {
                    classNames = "form-group has-error";
                    errorMessage = `This field is required`;
                }
            }

            return (
            <div className={classNames}>
                <label>
                    Raw Text
                </label>
                <textarea className="form-control"
                    placeholder="#!/bin/bash"
                    rows="6"
                    value={this.state.text}
                    onInput={this.onChangeText}
                    onBlur={this.onBlurText} />
                <span className="help-block">{errorMessage}</span>
            </div>
            )
        }
    },

    renderBody: function() {
        let title = this.state.title;
        let classNames = "form-group";
        let errorMessage = null;
        let disable = false;

        if (this.state.validate) {
            if (!this.isValidString(title)) {
                classNames = "form-group has-error";
                errorMessage = `This field is required`;
            }
            disable = !this.isSubmittable();
        }
        let typeChoices = ["URL", "Raw Text"],
            strategyTypes = [
                "once",
                "always"],
            strategyChoices = {
                "once": "Run Script on first boot",
                "always": "Run script on every deployment"};


        return (
            <div>
                <div>
                    <div className={classNames}>
                        <label>
                            Script Title
                        </label>
                        <input className="form-control"
                            placeholder="My Script"
                            value={this.state.title}
                            onInput={this.onChangeTitle}
                            onBlur={this.onBlurTitle} />
                        <span className="help-block">{errorMessage}</span>
                    </div>
                    <h4 className="t-body-2">Boot Script Type</h4>
                    <SelectMenu current={this.state.strategy}
                        optionName={strategy => strategyChoices[strategy] }
                        list={strategyTypes}
                        onSelect={this.onChangeStrategy} />

                    <h4 className="t-body-2">Input Type</h4>
                    <SelectMenu current={this.state.type}
                        optionName={type => type }
                        list={typeChoices}
                        onSelect={this.onChangeType} />

                    <div className="col-md-6">
                        {this.renderInputType()}
                    </div>
                </div>
            </div>
        )
    },
    render: function() {
        // Only show the warning if the field has content
        let notSubmittable = !this.isSubmittable();

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">{(this.props.script) ? "Update Deployment Script" : "Add a new Deployment Script"}</h1>
                    </div>
                    <div style={{ minHeight: "300px" }} className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={this.hide}>
                            Cancel
                        </button>
                        <button type="button"
                            aria-invalid={notSubmittable}
                            className="btn btn-primary"
                            onClick={(this.props.script) ? this.onSaveScript : this.onCreateScript}
                            disabled={notSubmittable}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
