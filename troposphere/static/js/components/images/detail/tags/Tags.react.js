import React from "react";
import Tag from "components/common/tags/Tag.react";

export default React.createClass({
    displayName: "Tags",
    propTypes: {
        activeTags: React.PropTypes.array,
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
