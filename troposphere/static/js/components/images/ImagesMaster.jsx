import React from "react";

import SecondaryImageNavigation from "./common/SecondaryImageNavigation";


export default React.createClass({
    displayName: "ImagesMaster",

    render: function() {
        return (
        <div>
            <SecondaryImageNavigation currentRoute="todo-remove-this" />
            {this.props.children}
        </div>
        );
    }
});
