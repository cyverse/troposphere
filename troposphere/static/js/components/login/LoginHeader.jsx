import React from 'react';
import Router from 'react-router';
import Backbone from 'backbone';
import toastr from 'toastr';

import modals from 'modals';
import context from 'context';
import globals from 'globals';

import { trackAction } from 'utilities/userActivity';
import { hasLoggedInUser } from 'utilities/profilePredicate';


let LoginLink = React.createClass({
    render: function() {
        let redirect_path = window.location.pathname;

        return (
        <li className="dropdown">
            <a id="login_link" href={"#"}>Login</a>
        </li>
        );
    }
});

let LoginHeader = React.createClass({
    displayName: "LoginHeader",

    propTypes: {
    },

    // We need the screen size for handling the opening and closing of our menu on small screens

    getInitialState: function() {
        return {
            windowWidth: window.innerWidth
        };
    },

    handleResize: function(e) {
        this.setState({
            windowWidth: window.innerWidth
        });
    },

    componentDidMount: function() {
        window.addEventListener("resize", this.handleResize);
    },

    componentWillUnmount: function() {
        window.removeEventListener("resize", this.handleResize);
    },

    render: function() {
        let brandLink = (
            <a id="brand_link" className="navbar-brand active" href={"#"} />
        );

        return (
        <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container">
                <div className="navbar-header">
                    <button type="button"
                        className="navbar-toggle"
                        data-toggle="collapse"
                        data-target=".navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    {brandLink}
                </div>
                <div className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <LoginLink/>
                    </ul>
                </div>
            </div>
        </div>
        );

    }
});

export default LoginHeader;
