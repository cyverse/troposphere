import Backbone from "backbone";
import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import SelectMenu from "components/common/ui/SelectMenu";
import actions from "actions";

export default React.createClass({

    propTypes: {
        script: React.PropTypes.instanceOf(Backbone.Model),
        style: React.PropTypes.object,
        footerClassName: React.PropTypes.string,
        onClose: React.PropTypes.func.isRequired,
        onScriptChanged: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return this.getStateFromProps(this.props);
    },

    getStateFromProps(props) {
        let script = props.script;
        let state = {
            title: "",
            text: "",
            type: "URL",
            strategy: "always",
            wait_for_deploy: true,
            validate: false
        };
        if(script) {
            let scriptState = {
                title: script.get('title'),
                text: script.get('text'),
                type: script.get('type'),
                strategy: script.get('strategy'),
                wait_for_deploy: script.get('wait_for_deploy'),
            }
            Object.assign(state, scriptState);
        }
        return state;
    },

    componentWillReceiveProps(props) {
        this.setState(this.getStateFromProps(props));
    },

    getDefaultProps: function() {
        return {
            style: {},
            footerStyle: { position: "absolute", bottom: "75px", right: "15px" },
            footerClassName: "",
            script: null
        }
    },

    onChangeDeploymentType: function(deploymentType) {
        this.setState({
            deploymentType
        })
    },

    onChangeStrategyType: function(strategyType) {
        this.setState({
            strategyType
        })
    },

    onChangeWaitForDeploy: function(e) {
        let boolStr = e.target.value,
            wait_for_deploy = boolStr == "true";
        this.setState({
            wait_for_deploy
        })
    },

    onChangeInputType: function(inputType) {
        this.setState({
            inputType
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
                    onChange={this.onChangeText}
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

    onCreateScript: function() {
        if (!this.state.validate) {
            this.setState({
                validate: true
            });
        }
        if (this.isSubmittable) {
            actions.ScriptActions.create({
                title: this.state.title.trim(),
                text: this.state.text.trim(),
                type: this.state.type,
                strategy: this.state.strategy
            });
            this.hide();
        }
    },

    onSaveScript: function() {
        if (!this.state.validate) {
            this.setState({
                validate: true
            });
        }
        if (this.isSubmittable) {
            let script = actions.ScriptActions.update(this.props.script, {
                title: this.state.title.trim(),
                text: this.state.text.trim(),
                type: this.state.type,
                strategy: this.state.strategy
            });
            return script;
        }
    },

    onSubmit: function() {
        let script;
        if( this.props.script) {
            script = this.onSaveScript();
        } else {
            script = this.onCreateScript();
        }
        this.props.onScriptChanged(script);
    },

    render: function() {
        let classNames = "form-group";
        let errorMessage = null;
        let notSubmittable = false;
        let headerText = (this.props.script) ? "Edit Script" : "Create Script";
        let inputTypes = [
                {"name": "URL"},
                {"name": "Raw Text"}],
            inputChoices = {
                "URL": "Import by URL",  // Advantages: update script external from Atmosphere
                "Raw Text": "Import by Text"
            },
            strategyTypes = [
                {"name": "once"},
                {"name": "always"}],
            strategyChoices = {
                "once": "Run Script on first boot",
                "always": "Run script on every deployment"
            },
            deploymentTypes = [
                {"name": "sync"},
                {"name": "async"}
            ],
            deploymentChoices = {
                "sync": "Wait for script to complete, ensure exit code 0, email me if there is a failure.",
                "async": "Execute scripts asynchronously. Store stdout/stderr to log files."};
        let {deploymentType, strategyType, inputType, title} = this.state;

        // TODO: Looking to tell the user where the scripts output/stderr will be stored? Add this content.. somewhere.
        // {"Log stdout in '/var/log/atmo/instance-scripts/"+this.state.title+".YYYY-MM-DD_HH:MM:SS.stdout'"}
        // {"Log stderr in '/var/log/atmo/instance-scripts/"+this.state.title+".YYYY-MM-DD_HH:MM:SS.stderr'"}

        if(!deploymentType) {
            deploymentType = deploymentTypes[0];
        }
        if(!strategyType) {
            strategyType = strategyTypes[0];
        }
        if(!inputType) {
            inputType = inputTypes[0];
        }


        if (this.state.validate) {
            if (!this.isValidString(title)) {
                classNames = "form-group has-error";
                errorMessage = `This field is required`;
            }
            notSubmittable = !this.isSubmittable();
        }

        return (
        <div style={this.props.style}>
            <h3 className="t-subheading">{headerText}</h3>
            <hr/>
            <div className="row">
                <div className={classNames}>
                    <label>{"Script Title"}</label>
                    <input className="form-control"
                        placeholder="My Script"
                        value={this.state.title}
                        onInput={this.onChangeTitle}
                        onBlur={this.onBlurTitle} />
                    <span className="help-block">{errorMessage}</span>
                </div>
                <h4 className="t-body-2">{"Boot Script Type"}</h4>
                <SelectMenu current={strategyType}
                    optionName={strategyType => strategyChoices[strategyType.name] }
                    list={strategyTypes}
                    onSelect={this.onChangeStrategyType} />

                <h4 className="t-body-2">{"Deployment Type"}</h4>
                <SelectMenu current={deploymentType}
                    optionName={deploymentType => deploymentChoices[deploymentType.name] }
                    list={deploymentTypes}
                    onSelect={this.onChangeDeploymentType} />

                <h4 className="t-body-2">{"Input Type"}</h4>
                <SelectMenu current={inputType}
                    optionName={inputType => inputChoices[inputType.name] }
                    list={inputTypes}
                    onSelect={this.onChangeInputType} />
                <div className="col-md-6">
                    {this.renderInputType()}
                </div>
            </div>
            <div className={this.props.footerClassName} style={this.props.footerStyle}>
                <RaisedButton
                    primary
                    className="pull-right"
                    disabled={notSubmittable}
                    onTouchTap={this.onSubmit}
                    label="Save"
                />
                <RaisedButton
                    className="pull-right"
                    style={{ marginRight: "10px" }}
                    onTouchTap={this.props.onClose}
                    label="Cancel"
                />
            </div>
        </div>
        );
    }
});
