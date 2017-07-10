import React from "react";
import Backbone from "backbone";
import stores from "stores";
import Id from "../details/sections/details/Id";
import Status from "../details/sections/details/Status";
import Size from "../details/sections/details/Size";
import Identity from "../details/sections/details/Identity";

export default React.createClass({
    displayName: "VolumePreviewView",

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var volume = stores.VolumeStore.get(this.props.volume.id);

        if (!volume) return <div className="loading"></div>;

        return (
        <ul>
            <Status volume={volume} />
            <Size volume={volume} />
            <Identity volume={volume} />
            <Id volume={volume} />
        </ul>
        );
    }
});
