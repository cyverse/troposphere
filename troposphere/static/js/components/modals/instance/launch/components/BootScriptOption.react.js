import React from 'react/addons';
import AddScripts from './AddScripts.react';
import CreateScript from './CreateScript.react';


export default React.createClass({

    getInitialState: function() {
        return {
            view: "ADDSCRIPT_VIEW"
        }
    },

    onCreateScript: function() {
        this.props.onDisableFooter();
        this.setState({
            view: "CREATESCRIPT_VIEW"
        });
    },

    onCloseCreateScript: function() {
        this.props.onEnableFooter();
        this.setState({
            view: "ADDSCRIPT_VIEW"
        })
    },

    renderSelectScripts: function() {
        return (
            <AddScripts {...this.props}
                onCreateScript={this.onCreateScript}
            />
        )
    },

    renderCreateScript: function() {
        return (
            <CreateScript {...this.props}
                close={this.onCloseCreateScript}
            />
        )
    },

    renderBody: function() {
        let view = this.state.view;
        switch(view) {
            case "ADDSCRIPT_VIEW":
            return this.renderSelectScripts()
            case "CREATESCRIPT_VIEW":
            return this.renderCreateScript()
        }
    },

    render: function() {
        return (
            <div>
                <h3 className="t-title">Deployment Scripts</h3>
                <hr/>
                {this.renderBody()}
            </div>
        )
    }
});
