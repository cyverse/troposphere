import _ from "underscore";
import React from "react";
import stores from "stores";

export default React.createClass({
    displayName: "RecordWebShell",

    getInitialState: function() {
        return {
            profile: stores.ProfileStore.get()
        };
    },

    updateState: function() {
        this.setState(this.getInitialState());
    },

    handleChange: function(e) {
        this.props.onChange(e);
    },

    render: function() {
        return (
        <div>
            <input type="checkbox" checked={this.props.checked} onChange={this.handleChange} /> Record Web Shell sessions<br/><br/>
        </div>
        );
    }

});
