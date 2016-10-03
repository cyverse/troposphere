import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Backbone from "backbone";

export default React.createClass({
    displayName: "Tag",

    propTypes: {
        tag: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        renderLinks: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            renderLinks: true
        }
    },

    onClick(e) {
        let { onTagClick } = this.props;
        e.stopPropagation();
        e.preventDefault();
        // Still causing a warning
        // "Failed Context Types: Required context `router`"
        if (onTagClick) {
            onTagClick(this.props.tag);
        }
    },

    componentDidMount: function() {
        // FIXME:
        // https://github.com/yannickcr/eslint-plugin-react/issues/678#issue-165177220
        var el = ReactDOM.findDOMNode(this),
            $el = $(el),
            tag = this.props.tag;

        $el.tooltip({
            title: tag.get("description"),
            placement: "left"
        });
    },

    render: function() {
        var tag = this.props.tag,
            tagName = tag.get("name"),
            link;

        if (this.props.renderLinks) {
            link = (
                <span onClick={ this.onClick }>
                    {tagName}
                </span>
            );
        } else {
            link = (
                <span>
                    {tagName}
                </span>
            )
        }

        return (
            <li className="tag">
                {link}
            </li>
        );
    }
});
