import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import actions from "actions";

export default React.createClass({
    getInitialState: function() {
        let script = this.props.script;
        if(! script) {
            return ({
                type: "URL",
                bootType: "always",
                title: "",
                text: "",
                validate: false
            })
        }
        return ({
            type: script.get('type'),
            bootType: script.get('boot_type') || 'always',  //Temporary
            title: script.get('title'),
            text: script.get('text'),
            validate: false
        });
    },
    propTypes: {
        script: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        style: React.PropTypes.object,
        close: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired
    },

    getDefaultProps: function() {
        return {
            style: { position: "absolute", bottom: "75px", right: "15px" }
        }
    },

    onChangeBootType: function(e) {
        let bootType = e.target.value;
        this.setState({
            bootType
        })
    },

    onChangeType: function(e) {
        let type = e.target.value;
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

    onSaveScript: function() {
        if (!this.state.validate) {
            this.setState({
                validate: true
            });
        }
        if (this.isSubmittable) {
            let script = actions.ScriptActions.update(this.props.script, {
                type: this.state.type,
                title: this.state.title.trim(),
                text: this.state.text.trim()
            });
            this.props.onSave(script);
            this.props.close();
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

    render: function() {
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

        return (

        <div style={{ position: "reletive" }}>
            <h3 className="t-subheading">Edit Script</h3>
            <hr/>
            <div className="row">
                <div className="col-md-6">
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
                    <h4 className="t-body-2">Input Type</h4>
                    <div className="radio-inline">
                        <label className="radio">
                            <input type="radio"
                                name="optionsRadios"
                                value="URL"
                                defaultChecked={this.state.type === "URL"}
                                onClick={this.onChangeType} /> URL
                        </label>
                    </div>
                    <div className="radio-inline">
                        <label className="radio">
                            <input type="radio"
                                name="optionsRadios"
                                value="Raw Text"
                                defaultChecked={this.state.type === "Raw Text"}
                                onClick={this.onChangeType} /> Raw Text
                        </label>
                    </div>
                    <h4 className="t-body-2">Boot Script Type</h4>
                    <div className="radio-inline">
                        <label className="radio">
                            <input type="radio"
                                name="optionsRadios-2"
                                value="once"
                                defaultChecked={this.state.boot_type === "once"}
                                onClick={this.onChangeBootType} /> Run on launch only
                        </label>
                    </div>
                    <div className="radio-inline">
                        <label className="radio">
                            <input type="radio"
                                name="optionsRadios-2"
                                value="always"
                                defaultChecked={this.state.type === "always"}
                                onClick={this.onChangeBootType} /> Run every deployment
                        </label>
                    </div>
                </div>
                <div className="col-md-6">
                    {this.renderInputType()}
                </div>
            </div>
            <div style={this.props.style}>
                <RaisedButton
                    primary
                    className="pull-right"
                    disabled={disable}
                    onTouchTap={this.onSaveScript}
                    label="Save"
                />
                <RaisedButton
                    className="pull-right"
                    style={{ marginRight: "10px" }}
                    onTouchTap={this.props.close}
                    label="Cancel"
                />
            </div>
        </div>
        )
    }
});
