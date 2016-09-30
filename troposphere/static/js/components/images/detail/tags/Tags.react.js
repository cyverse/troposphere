import React from "react";
import Backbone from "backbone";
import Tag from "components/common/tags/Tag.react";

export default React.createClass({
    displayName: "Tags",
    // We are calling first() on some of our collections,
    // those are returned as an array :(
    propTypes: {
        activeTags: React.PropTypes
            .oneOfType([ 
                React.PropTypes.array,  
                React.PropTypes.object 
            ]).isRequired
    },

    render: function() {
        var tags = this.props.activeTags.map(function(tag) {
            return (
            <Tag key={tag.id || tag.cid} tag={tag} />
            );
        }.bind(this));

        return (
        <ul className="tags clearfix">
            {tags}
        </ul>
        );
    }
});
