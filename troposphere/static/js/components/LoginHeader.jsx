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

let LogoutLink = React.createClass({

    propTypes: {
        username: React.PropTypes.string.isRequired
    },

    onShowVersion: function(e) {
        e.preventDefault();
        modals.VersionModals.showVersion();
    },

    render: function() {
        let statusPageEl;
        let username = this.props.username;

        if (!username && window.show_public_site) {
            username = "AnonymousUser"
        }
        if (globals.STATUS_PAGE_LINK) {
            statusPageEl = (
                <li>
                    <a href={globals.STATUS_PAGE_LINK} target="_blank">Status</a>
                </li>
            );
        }

        let trackSettings = () => {
            trackAction("viewed-settings", {});
        };

        let trackRequests = () => {
            trackAction("viewed-requests", {});
        };

        if (!username && window.show_public_site) {
            username = "AnonymousUser"
        }


        return (
        <li className="dropdown">
            <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                {username} <b className="caret"></b></a>
            <ul className="dropdown-menu">
                <li>
                    <Link to="settings" onClick={trackSettings}> Settings
                    </Link>
                </li>
                <li>
                    <Link to="my-requests-resources" onClick={trackRequests}> My requests
                    </Link>
                </li>
                <li>
                    <a id="version_link" href="#" onClick={this.onShowVersion}>Version</a>
                </li>
                {statusPageEl}
                <li>
                    <a id="logout_link" href="/logout?force=true&airport_ui=false">Sign out</a>
                </li>
            </ul>
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
        let profile = this.props.profile;
        let loggedIn = hasLoggedInUser(profile);

        let loginLogoutDropdown = loggedIn
            ? <LogoutLink username={profile.get("username")} />
            : <LoginLink/>;

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
                        {loginLogoutDropdown}
                    </ul>
                </div>
            </div>
        </div>
        );

    }
});

export default LoginHeader;
