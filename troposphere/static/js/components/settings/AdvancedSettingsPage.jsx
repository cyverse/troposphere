import React from "react";

import SSHConfiguration from "components/settings/advanced/SSHConfiguration";


export default React.createClass({
    displayName: "AdvancedSettingsPages",

    getInitialState: function() {
        return {
            showMore: false,
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
    renderClientCredentials: function() {
        //return (
        //    <ClientCredentials/>
        //);
    },

    renderMore: function() {
        return (
        <div style={{ marginLeft: "30px" }}>
            {/* this.renderClientCredentials() -- Make this a feature before removing the comments*/}
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
