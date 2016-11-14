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
        let tag = this.props.tag;
        let tagName = tag.get("name");

        return (
            <li className="tag">
                <span onClick={ this.onClick }>
                    {tagName}
                </span>
            </li>
        );
    }
});
