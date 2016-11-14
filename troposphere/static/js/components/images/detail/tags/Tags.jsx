import React from "react";
import Router from "react-router";
import RouterInstance from "Router";
import Tag from "components/common/tags/Tag";

export default React.createClass({
    displayName: "Tags",
    propTypes: {
        activeTags: React.PropTypes.array,
    },

    mixins: [Router.State],

    onTagClick(tag) {
        RouterInstance.getInstance()
            .transitionTo("search",null,{
                q: tag.get('name')
            });
    },

    render: function() {
        var tags = this.props.activeTags.map(function(tag) {
            return (
                <Tag
                    key={tag.id || tag.cid}
                    tag={tag} onTagClick={ this.onTagClick }
                />
            );
        }.bind(this));

        return (
        <ul className="tags clearfix">
            {tags}
        </ul>
        );
    }
});
