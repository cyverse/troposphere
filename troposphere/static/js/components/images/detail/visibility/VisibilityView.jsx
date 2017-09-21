import React from "react";
import Backbone from "backbone";


export default React.createClass({
    displayName: "VisibilityView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var image = this.props.image;

        return (
        <div className="image-info-segment row">
            <h4 className="t-body-2 col-md-2">Visibility:</h4>
            <p className="content col-md-10">
                {image.get("is_public") ? "Public" : "Private" }
            </p>
        </div>
        );
    }
});
