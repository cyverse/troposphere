import React from 'react/addons';
import actions from 'actions';

export default React.createClass({
    getInitialState: function()  {
        return({
            type: "URL",
            title: {value: "Hello World", pass: true},
            text: {value: "https://raw.githubusercontent.com/iPlantCollaborativeOpenSource/atmosphere-ansible/master/user_scripts/hello_world.sh", pass: true},
            isValid: false
        })
    },

    onChangeType: function(e) {
        let type = e.target.value;
        let text = {};
        text.pass = true;
        if (type === "Raw Text") {
            text.value = "#!/bin/bash \n echo Hello World";
        }
        if (type === "URL") {
            text.value = "https://raw.githubusercontent.com/iPlantCollaborativeOpenSource/atmosphere-ansible/master/user_scripts/hello_world.sh";
        }
        this.setState({
            type,
            text
        })
    },

    onChangeTitle: function(e) {
        let title = {};
        title.value = e.target.value;
        title.pass= false;
        if (title.value !== "") {
            title.pass = true
        }
        this.setState({
            title
        })
    },

    onChangeText: function(e) {
        let text = {};
        text.value = e.target.value;
        text.pass= false;
        if (text.value !== "") {
            text.pass = true;
            if (this.state.type === "URL") {
                if (text.value.search("https?://") < 0) {
                    text.pass = false;
                }
            }
        }
        this.setState({
            text
        })
    },

    onCreateScript: function() {
        let script = actions.ScriptActions.create({
            type: this.state.type,
            title: this.state.title.value.trim(),
            text: this.state.text.value
        });

        this.props.onAddAttachedScript(script);
        this.props.close();
    },

    renderInputType: function() {
        let text = this.state.text;
        let classNames = "form-group " + (text.pass ? "" : "has-error");
        if (this.state.type === "URL") {
            return (
                <div className={classNames}>
                    <label>Script URL</label>
                    <input className="form-control" value={this.state.text.value}
                        onInput={this.onChangeText}
                    />
                </div>
            )
        }
        else {
            return (
                <div className={classNames}>
                    <label>Full Text</label>
                    <textarea className="form-control" rows="6" value={this.state.text.value}
                        onInput={this.onChangeText}
                    />
                </div>
            )
        }
    },

    render: function() {
        let title = this.state.title;
        let text = this.state.text;
        let isDisabled = "disabled";
        if (title.pass && text.pass) {
            isDisabled = "";
        }

        return (

            <div style={{position:"reletive"}}>
                <h3 className="t-subheading">Create and Add a New Script</h3>
                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        <div className={ "form-group " + (title.pass ? "" : "has-error") }>
                            <label>Script Tilte</label>
                            <input className="form-control"
                                value={this.state.title.value}
                                onInput={this.onChangeTitle}
                            />
                        </div>

                        <h4 className="t-body-2">Input Type</h4>
                        <div className="radio-inline">
                            <label className="radio">
                                <input type="radio" name="optionsRadios" 
                                    value="URL"
                                    checked={this.state.type === "URL"}
                                    onClick={this.onChangeType}
                                />
                                URL
                            </label>
                        </div>
                        <div className="radio-inline">
                            <label className="radio">
                                <input type="radio" name="optionsRadios" 
                                    value="Raw Text"
                                    checked={this.state.type === "Raw Text"}
                                    onClick={this.onChangeType}
                                />
                                Full Text
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                            {this.renderInputType()}
                    </div>
                </div>
                <div style={{position: "absolute", bottom: "75px", right: "15px"}}>
                    <a className="btn btn-primary pull-right"
                        onClick={this.onCreateScript}
                        disabled={isDisabled}
                    >
                        Save and Add Script
                    </a>
                    <a className="btn btn-default pull-right" 
                        style={{marginRight: "10px"}}
                        onClick={this.props.close}
                    >
                        Cancel Create Script
                    </a>
                </div>
            </div>
        )
    }
});
