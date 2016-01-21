import React from 'react/addons';
import actions from 'actions';

export default React.createClass({
    getInitialState: function()  {
        return({
            type: "URL"
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

    onChangeText: function(e) {
        let text = e.target.value;
        this.setState({
            text
        })
    },

    onCreateScript: function() {
        let script = actions.ScriptActions.create({
            title: this.state.title,
            type: this.state.type,
            text: this.state.text
        });

        this.props.onAddAttachedScript(script);
        this.props.close();
    },

    renderInputType: function() {
        if (this.state.type === "URL") {
            return (
                <div className="form-group">
                    <label>Script URL</label>
                    <input className="form-control"
                        onInput={this.onChangeText}
                    />
                </div>
            )
        }
        else {
            return (
                <div className="form-group">
                    <label>Full Text</label>
                    <textarea className="form-control" rows="6"
                        onInput={this.onChangeText}
                    />
                </div>
            )
        }
    },

    render: function() {
        return (
            <div style={{position:"reletive"}}>
                <h3 className="t-subheading">Create and Add a New Script</h3>
                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Script Tilte</label>
                            <input className="form-control"
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
