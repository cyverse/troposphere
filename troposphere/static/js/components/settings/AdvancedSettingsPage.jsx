import React from "react";
import featureFlags from "utilities/featureFlags";
import SSHConfiguration from "components/settings/advanced/SSHConfiguration";
import ScriptListView from "components/settings/advanced/ScriptListView";
import InstanceAccessListView from "components/common/InstanceAccessListView";
import ClientCredentials from "components/settings/advanced/ClientCredentials";


export default React.createClass({
    displayName: "AdvancedSettingsPages",

    getInitialState: function() {
        return {
            showMore: true,
        };
    },

    updateState: function() {
        this.setState(this.getInitialState());
    },

    showToggle: function() {
        this.setState({
            showMore: !this.state.showMore
        });
    },
    renderInstanceAccessRequests: function() {
        return (
            <InstanceAccessListView/>
        );
    },

    renderScripts: function() {
        return (
            <ScriptListView/>
        );
    },

    renderClientCredentials: function() {
        if (!featureFlags.showClientCredentials()) {
            return ;
        }
        return (
            <ClientCredentials/>
        );
    },

    renderMore: function() {
        return (
        <div style={{ marginLeft: "30px" }}>
            {this.renderClientCredentials()}
            {this.renderScripts()}
            {this.renderInstanceAccessRequests()}
            <SSHConfiguration/>
            <button onClick={this.showToggle}>
                Show Less
            </button>
        </div>
        );
    },

    renderLess: function() {
        return <button onClick={this.showToggle}>
                   Show More
               </button>
    },

    render: function() {
        return (
        <div>
            <div>
                <h3 className="t-title">Advanced</h3>
                {this.state.showMore ?
                 this.renderMore() :
                 this.renderLess()}
            </div>
        </div>
        );
    }
});
