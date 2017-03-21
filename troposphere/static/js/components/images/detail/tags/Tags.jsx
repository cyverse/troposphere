import React from "react";
import { withRouter } from "react-router";

import Tag from "components/common/tags/Tag";


const Tags = React.createClass({
    displayName: "Tags",

    propTypes: {
        activeTags: React.PropTypes.array,
    },

    onTagClick(tag) {
        this.props.router.push({
            pathname: "images/search",
            query: { q: tag.get('name') }
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

export default withRouter(Tags);
