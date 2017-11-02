import React from "react";
import EditDescriptionView from "components/images/detail/description/EditDescriptionView";


export default React.createClass({
    displayName: "CreateScriptView",

    propTypes: {
        onCreateScript: React.PropTypes.func.isRequired,
        scriptTitle: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            scriptTitle: this.props.scriptTitle || "",
            scriptType: "URL",
            scriptURL: "",
            scriptText: "",
            strategy: "always",
            wait_for_deploy: true
        }
    },
    isSubmittable: function() {
        if (!this.state.scriptTitle) {
            return false;
        } else if (this.state.scriptType == "URL") {
            if (this.state.scriptURL.search("https?://") < 0) {
                return false
            }
        //NOTE: Implicit 'full-text' type test
        } else if (this.state.scriptText.length < 4) {
            return false;
        }
        //Tests passed
        return true;
    },
    onCreateScript: function(e) {
        var params = {
            title: this.state.scriptTitle,
            type: this.state.scriptType,
            text: (this.state.scriptType == "URL") ? this.state.scriptURL : this.state.scriptText,
            strategy: this.state.strategy.trim(),
            wait_for_deploy: this.state.wait_for_deploy
        };
        this.props.onCreateScript(params);
    },
    onScriptInputTypeChange: function(e) {
        var script_type = e.target.value;
        if (script_type == "URL") {
            this.setState({
                scriptType: script_type
            });
        } else {
            this.setState({
                scriptType: "Raw Text"
            });
        }
    },
    onScriptURLChange: function(e) {
        var url_text = e.target.value;
        this.setState({
            scriptURL: url_text
        })
    },
    onScriptTextChange: function(e) {
        var full_text = e.target.value;
        this.setState({
            scriptText: full_text
        })
    },
    onScriptTitleChange: function(e) {
        var title = e.target.value;
        this.setState({
            scriptTitle: title
        })
    },
    onChangeDeployment: function(e) {
        let deployType = e.target.value === "sync";
        this.setState({
            wait_for_deploy: deployType
        })
    },
    onChangeStrategy: function(e) {
        let strategy = e.target.value;
        this.setState({
            strategy
        })
    },
    renderScriptSelection: function() {
        if (this.state.scriptType == "URL") {
            return (
            <div className="form-group">
                <label htmlFor="version-version">
                    Script URL
                </label>
                <input type="text"
                    className="form-control"
                    value={this.state.scriptURL}
                    onChange={this.onScriptURLChange} />
            </div>
            );
        } else {
            //"Raw Text"
            return (<EditDescriptionView title={"Raw Text"} value={this.state.scriptText} onChange={this.onScriptTextChange} />)
        }
    },
    renderScriptInputRadio: function() {
        var urlRadio,
            fullTextRadio;

        //NOTE: There must be a better way ..? -Steve
        if (this.state.scriptType == "URL") {
            urlRadio = (
                <label className="radio-inline">
                    <input checked="checked"
                        type="radio"
                        name="inlineScriptOptions"
                        id="scriptTypeURL"
                        value="URL"
                        onChange={this.onScriptInputTypeChange} /> URL
                </label>);
            fullTextRadio = (
                <label className="radio-inline">
                    <input type="radio"
                        name="inlineScriptOptions"
                        id="scriptTypeText"
                        value="Raw Text"
                        onChange={this.onScriptInputTypeChange} /> Raw Text
                </label>);
        } else {
            urlRadio = (
                <label className="radio-inline">
                    <input type="radio"
                        name="inlineScriptOptions"
                        id="scriptTypeURL"
                        value="URL"
                        onChange={this.onScriptInputTypeChange} /> URL
                </label>);
            fullTextRadio = (
                <label className="radio-inline">
                    <input checked="checked"
                        type="radio"
                        name="inlineScriptOptions"
                        id="scriptTypeText"
                        value="Raw Text"
                        onChange={this.onScriptInputTypeChange} /> Raw Text
                </label>);
        }

        return (
        <div className="scriptRenderRadio">
            <label htmlFor="scriptTypeSelect">
                Input Type
            </label>
            <div className="form-group">
                {urlRadio}
                {fullTextRadio}
            </div>
        </div>
        );
    },
    renderScriptTitle: function() {
        return (<div className="form-group">
                    <label htmlFor="scriptTitle">
                        Script Title
                    </label>
                    <input type="text"
                        className="form-control"
                        id="scriptTitle"
                        placeholder="Title"
                        value={this.state.scriptTitle}
                        onChange={this.onScriptTitleChange} />
                </div>
        );
    },
    renderExecutionStrategyType: function() {
        return (
            <div className="form-group">
                <label htmlFor="strategyTypeRadios">
                    Strategy Type
                </label>
                <div className="radio">
                    <label className="radio">
                        <input type="radio"
                               name="strategyTypeRadios"
                               value="once"
                               defaultChecked={this.state.strategy === "once"}
                               onClick={this.onChangeStrategy} /> {"Run script on first boot"}
                    </label>
                </div>
                <div className="radio">
                    <label className="radio">
                        <input type="radio"
                               name="strategyTypeRadios"
                               value="always"
                               defaultChecked={this.state.strategy === "always"}
                               onClick={this.onChangeStrategy} /> {"Run script on each deployment"}
                    </label>
                </div>
            </div>
        );
    },
    renderDeploymentType: function () {
        return (
            <div className="form-group">
                <label htmlFor="deploymentTypeRadios">
                    Deployment Type
                </label>
                <div className="radio">
                    <label className="radio">
                        <input type="radio"
                               name="deploymentTypeRadios"
                               value="once"
                               defaultChecked={this.state.wait_for_deploy}
                               onClick={this.onChangeDeployment} /> {"Wait for script to complete"}
                    </label>
                </div>
                <div className="radio">
                    <label className="radio">
                        <input type="radio"
                               name="deploymentTypeRadios"
                               value="always"
                               defaultChecked={!this.state.wait_for_deploy}
                               onClick={this.onChangeDeployment} /> {"Execute script asynchronously"}
                    </label>
                </div>
            </div>
        );
    },
    render: function() {
        return (

        <div className="new-script-form new-item-form">
            <div className="script-input-type-container">
                {this.renderScriptTitle()}
                {this.renderScriptInputRadio()}
                {this.renderScriptSelection()}
                {this.renderExecutionStrategyType()}
                {this.renderDeploymentType()}
            </div>
            <div className="new-item-form-header form-group clearfix" style={{ "border": "black 1px" }}>
                <button disabled={!this.isSubmittable()}
                    onClick={this.onCreateScript}
                    type="button"
                    className="btn btn-primary btn-sm pull-right"
                    style={{ marginTop: "20px" }}>
                    {"Create and Add"}
                </button>
            </div>
        </div>
        );
    }
});
