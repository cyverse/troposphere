import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Backbone from "backbone";
import Router from "react-router";


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
                <Router.Link to="search" query={{ q: tagName }}>
                    {tagName}
                </Router.Link>
            );
        } else {
            link = (
                <a href="javascript:void(0)">
                    {tagName}
                </a>
            )
        }

        return (
        <li className="tag">
            {link}
        </li>
        );

    }
});
