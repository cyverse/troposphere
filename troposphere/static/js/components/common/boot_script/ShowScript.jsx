import Backbone from "backbone";
import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import SelectMenu from "components/common/ui/SelectMenu";
import actions from "actions";

function doNothing() {};

export default React.createClass({
    displayName: "ShowScript",

    propTypes: {
        script: React.PropTypes.instanceOf(Backbone.Model),
        style: React.PropTypes.object,
        footerClassName: React.PropTypes.string,
        onClose: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return this.getStateFromProps(this.props);
    },

    getStateFromProps(props) {
        let script = props.script;
        let state = {},
            scriptState;

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

    renderInputType: function() {
        let classNames = "form-group";

        if (this.state.type === "URL") {

            return (
            <div className={classNames}>
                <label htmlFor="script-url">
                    Script URL
                </label>
                <input id="script-url"
                    className="form-control"
                    placeholder="http://yourscript.org"
                    readOnly
                    value={this.state.text} />
            </div>
            )
        } else {
            return (
            <div className={classNames} >
                <label htmlFor="script-raw-text">
                    Raw Text
                </label>
                <textarea id="script-raw-text"
                    className="form-control"
                    placeholder="#!/bin/bash"
                    readOnly
                    rows="6"
                    value={this.state.text} />
            </div>
            )
        }
    },

    renderDeploymentOptionsHint() {
        if(this.state.wait_for_deploy) {
            return null;
        }
        let stdoutPath = "/var/log/atmo/instance-scripts/"+this.state.title+".YYYY-MM-DD_HH:MM:SS.stdout",
            stderrPath = "/var/log/atmo/instance-scripts/"+this.state.title+".YYYY-MM-DD_HH:MM:SS.stderr";
        return (
            <div className="help-block">
                {"stdout will be logged on the VM at: "}
                <br/>
                <code>{stdoutPath}</code>
                <br/>
                {"stderr will be logged on the VM at: "}
                <br/>
                <code>{stderrPath}</code>
            </div>
        );
    },

    renderDeploymentOptions() {
        // deploymentType is a key into options 'type', i.e. ("sync","async",...)
        let options = [
            {
                wait_for_deploy: true,
                type: "sync",
                message: "Sync - wait for script to complete, ensure exit code 0, email me if there is a failure."
            },
            {
                wait_for_deploy: false,
                type: "async",
                message: "Async - execute scripts asynchronously. Store stdout/stderr to log files."
            }
        ];
        let { wait_for_deploy } = this.state;
        let current = options.find(option => option.wait_for_deploy == wait_for_deploy);

        return (
            <SelectMenu current={ current }
                        optionName={ o => o.message }
                        list={ options }
                        onSelect={ doNothing }
                        disabled />
        );
    },

    renderStrategyOptions() {
        // strategyType is a key into options 'type', i.e. ("once","always",...)
        let { strategy } = this.state;
        let options = [
            { type: "once", message: "Once - run script on first boot" },
            { type: "always", message: "Always - run script on every deployment" }
        ];
        let current = options.find(option => option.type == strategy);
        return (
            <SelectMenu current={ current }
                        optionName={ o => o.message }
                        list={ options }
                        onSelect={ doNothing }
                        disabled />
        );
    },

    renderInputOptions() {
        let options = [
                {type: "URL", message: "Import by URL"},
                {type: "Raw Text", message: "Import by Text"}
            ];
        let {type} = this.state;
        let current = options.find(option => option.type == type);

        return (
            <SelectMenu current={ current }
                        optionName={ o => o.message }
                        list={ options }
                        onSelect={ doNothing }
                        disabled />
        );
    },

    render: function() {
        let { title } = this.state;

        let classNames = "form-group",
            headerText = "Current Script",
            errorMessage = null,
            notSubmittable = false;

        return (
        <div style={this.props.style}>
            <h3 className="t-subheading">{headerText}</h3>
            <hr/>
            <div>
                <div className={classNames}>
                    <label>{"Script Title"}</label>
                    <input className="form-control"
                           placeholder="My Script"
                           value={title}
                           readOnly />
                    <span className="help-block">{errorMessage}</span>
                </div>
                <h4 className="t-body-2">{"Execution Strategy Type"}</h4>
                <div className={classNames}>
                    { this.renderStrategyOptions() }
                </div>
                <h4 className="t-body-2">{"Deployment Type"}</h4>
                <div className={classNames}>
                    { this.renderDeploymentOptions() }
                    { this.renderDeploymentOptionsHint() }
                </div>
                <h4 className="t-body-2">{"Input Type"}</h4>
                <div className={classNames}>
                    { this.renderInputOptions() }
                </div>
                <div>
                    { this.renderInputType() }
                </div>
            </div>
            <div className={this.props.footerClassName} style={this.props.footerStyle}>
                <RaisedButton
                    primary
                    className="pull-right"
                    style={{ marginRight: "10px" }}
                    onTouchTap={this.props.onClose}
                    label="Okay"
                />
            </div>
        </div>
        );
    }
});
