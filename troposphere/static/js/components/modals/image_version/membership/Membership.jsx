import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";
import { Link, withRouter } from "react-router";


const Membership = React.createClass({
    displayName: "Membership",

    propTypes: {
        membership: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        renderLinks: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            renderLinks: true
        }
    },

    componentDidMount: function() {
        var el = ReactDOM.findDOMNode(this),
            $el = $(el),
            membership = this.props.membership;

        $el.tooltip({
            title: membership.get("name")
        });
    },

    onClick: function() {
        this.context.router.push({
            pathname: 'images/search',
            query:{
                q: this.props.membership.get("name")
            }
        });
    },

    render: function() {
        var membership = this.props.membership,
            membershipName = membership.get("name"),
            link;


        if (this.props.renderLinks) {
            let descriptor = {
                pathname: "images/search",
                query:{ q: membershipName }
            };
            link = (
                <Link to={descriptor}>
                    {membershipName}
                </Link>
            );
        } else {
            link = (
                <a href="javascript:void(0)">
                    {membershipName}
                </a>
            )
        }

        return (
        <li className="membership">
            {link}
        </li>
        );

    }
});

export default withRouter(Membership);
