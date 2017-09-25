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
        let state = {},
            scriptState,
            defaults = {
            title: "",
            text: "",
            type: "URL",
            strategy: "always",
            wait_for_deploy: true,
            validate: false
        };
        if(script) {
            scriptState = {
                title: script.get('title'),
                text: script.get('text'),
                type: script.get('type'),
                strategy: script.get('strategy'),
                wait_for_deploy: script.get('wait_for_deploy'),
            }
        }
        state = {
            ...defaults,
            ...scriptState
        };
        return state;
    },

    componentWillReceiveProps(props) {
        this.setState(this.getStateFromProps(props));
    },

    getDefaultProps: function() {
        return {
            style: {},
            footerStyle: {},
            footerClassName: "",
            script: null
        }
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
                <div className="help-block">
                    {errorMessage}
                </div>
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
                    onChange={this.onChangeText}
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

    onChangeDeploymentType: function(deploymentOpt) {
        let wait_for_deploy = deploymentOpt.type == "sync";

        this.setState({
            wait_for_deploy
        });
    },
    onChangeStrategyType: function(strategyOpt) {
        this.setState({
            strategy: strategyOpt.type
        })
    },
    onChangeInputType: function(inputOpt) {
        this.setState({
            type: inputOpt.type
        })
    },

    renderDeploymentOptionsHint() {
        if(this.state.wait_for_deploy) {
            return;
        }
        let stdoutPath = "/var/log/atmo/instance-scripts/"+this.state.title+".YYYY-MM-DD_HH:MM:SS.stdout",
            stderrPath = "/var/log/atmo/instance-scripts/"+this.state.title+".YYYY-MM-DD_HH:MM:SS.stderr";
        return (
            <div className="help-block">
                {"Stdout will be logged on the VM at: "}
                <br/>
                {stdoutPath}
                <br/>
                {"Stderr will be logged on the VM at: "}
                <br/>
                {stderrPath}
            </div>
        );

    },
    renderDeploymentOptions() {
        // deploymentType is a key into options 'type', i.e. ("sync","async",...)
        let options = [
            { wait_for_deploy: true, type: "sync", message: "Wait for script to complete, ensure exit code 0, email me if there is a failure." },
            { wait_for_deploy: false, type: "async", message: "Execute scripts asynchronously. Store stdout/stderr to log files." }
        ];
        let { wait_for_deploy } = this.state;
        let current = options.find(option => option.wait_for_deploy == wait_for_deploy);

        return (
            <SelectMenu current={ current }
                optionName={ o => o.message }
                list={ options }
                onSelect={ this.onChangeDeploymentType }
            />
        );
    },

    renderStrategyOptions() {
        // strategyType is a key into options 'type', i.e. ("once","always",...)
        let { strategy } = this.state;
        let options = [
            { type: "once", message: "Run Script on first boot" },
            { type: "always", message: "Run script on every deployment" }
        ];
        let current = options.find(option => option.type == strategy);
        return (
            <SelectMenu current={current}
                optionName={ o => o.message }
                list={options}
                onSelect={this.onChangeStrategyType} />
        );
    },

    renderInputOptions() {
        let options = [
                {type: "URL", message: "Import by URL"},
                {type: "Raw Text", message: "Import by Text"}
            ];
        let {type} = this.state;
        let current = options.find(option => option.type == type);

        return (<SelectMenu current={current}
                    optionName={ o => o.message }
                    list={options}
                onSelect={this.onChangeInputType} />
            );
    },

    render: function() {
        let classNames = "form-group";
        let errorMessage = null;
        let notSubmittable = false;
        let headerText = (this.props.script) ? "Edit Script" : "Create Script";
        let {title} = this.state;



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
                        onChange={this.onChangeTitle}
                        onBlur={this.onBlurTitle} />
                    <span className="help-block">{errorMessage}</span>
                </div>
                <h4 className="t-body-2">{"Strategy"}</h4>
                { this.renderStrategyOptions() }
                <h4 className="t-body-2">{"Deployment"}</h4>
                { this.renderDeploymentOptions() }
                { this.renderDeploymentOptionsHint() }
                <h4 className="t-body-2">{"Input Type"}</h4>
                {this.renderInputOptions()}
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
