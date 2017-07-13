import React from 'react';
import { Link } from 'react-router';
import Backbone from 'backbone';
import toastr from 'toastr';

import MaintenanceMessageBanner from './MaintenanceMessageBanner';
import Glyphicon from 'components/common/Glyphicon';
import context from 'context';
import globals from 'globals';
import modals from 'modals';
import logoPath from 'themeImages/mini_logo.png';

import { trackAction } from 'utilities/userActivity';
import { hasLoggedInUser } from 'utilities/profilePredicate';
import { deleteCookie } from "utilities/cookieHelpers";

const links = [
    {
        name: "Dashboard",
        linksTo: "dashboard",
        href: "/application/dashboard",
        icon: "stats",
        requiresLogin: true,
    },
    {
        name: "Projects",
        linksTo: "projects",
        href: "/application/projects",
        icon: "folder-open",
        requiresLogin: true
    },
    {
        name: "Images",
        linksTo: "images",
        href: "/application/images",
        icon: "floppy-disk",
        requiresLogin: false
    },
    /* TODO: make this enabled/disabled based on `featureFlags.showIdentityView()`
    {
        name: "Identities",
        linksTo: "identities",
        href: "/application/identities",
        icon: "cloud",
        requiresLogin: true
    }
    */
// This is a little ugly, but we conditionally include an element in a
// list
].concat([
    {
        name: "Help",
        linksTo: "help",
        href: "/application/help",
        icon: "question-sign",
        requiresLogin: false
    },
    {
        name: "Admin",
        linksTo: "admin",
        href: "/application/admin",
        icon: "cog",
        requiresLogin: true,
        requiresStaff: true
    }
]);

let LoginLink = React.createClass({
    onLogin: function(e) {
        e.preventDefault();
        modals.PublicModals.showPublicLoginModal();
    },
    renderLink: function() {
        if(window.use_login_selection) {
            return (
                <a id="login_link" href="#" onClick={this.onLogin}>Login</a>
            );
        } else {
            return (
                <a id="login_link" href="/login">Login</a>
            );
        }

    },
    render: function() {
        return (
        <li className="dropdown">
            {this.renderLink()}
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

    onLogout: function(e) {
        e.preventDefault();
        deleteCookie('auth_token');
        window.location = '/logout?force=true&airport_ui=false';
    },

    onExpiredPassword: function(e) {
        e.preventDefault();
        modals.ExpiredPasswordModals.show();
        trackAction("shown-expired-password-info", {});
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

        let expiredBadge = null,
            expiredMenuItem = null;

        if (context.hasExpiredPassword()) {
            let style = {
                color: "red",
                background: "white",
                borderRadius: "50%",
                marginRight: "3px"
            };
            expiredBadge = (
                // Glyphicon is not attended to accept styles
                // - so let's create exactly what we want
                <i className={"glyphicon glyphicon-exclamation-sign"}
                   style={style} />
            );
            expiredMenuItem = (
                <li>
                    <a id="expired_password_link"
                       href="#" style={{color: "red"}}
                       onClick={this.onExpiredPassword}>
                        <Glyphicon name="exclamation-sign" />
                        Expired Password</a>
                </li>
            );
        }

        return (
        <li className="dropdown">
            <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                {expiredBadge}{username} <b className="caret"></b></a>
            <ul className="dropdown-menu">
                {expiredMenuItem}
                <li>
                    <Link to="settings"
                          onClick={trackSettings}> Settings
                    </Link>
                </li>
                <li>
                    <Link to="my-requests/resources"
                          onClick={trackRequests}> My requests
                    </Link>
                </li>
                <li>
                    <a id="version_link" href="#" onClick={this.onShowVersion}>Version</a>
                </li>
                {statusPageEl}
                <li>
                    <a id="logout_link" href="#" onClick={this.onLogout}>Sign out</a>
                </li>
            </ul>
        </li>
        );
    }
});

let Header = React.createClass({
    displayName: "Header",

    propTypes: {
        profile: React.PropTypes.instanceOf(Backbone.Model),
        currentRoute: React.PropTypes.array.isRequired
    },

    // We need the screen size for handling the opening and closing of our menu on small screens
    //See navLinks below for implementation.

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

    handleNotice: function() {
        if (context.hasMaintenanceNotice()) {
            var notice = context.getMaintenanceNotice();
            toastr.warning(
                notice['message'],
                notice['title'],
                {
                    "toastClass": "toast toast-mod-info-darken",
                    "positionClass": "toast-top-full-width",
                    "closeButton": true,
                    "timeOut": 0,
                    "extendedTimeOut": 0,
                    "tapToDismiss": false,
                    "closeOnHover": false
                }
            );
        }
    },

    componentDidMount: function() {
        window.addEventListener("resize", this.handleResize);
        this.handleNotice();
    },

    componentWillUnmount: function() {
        window.removeEventListener("resize", this.handleResize);
    },

    renderNavLinks() {
        let profile = this.props.profile;
        let loggedIn = hasLoggedInUser(profile);
        let navLinks = links;

        if (!loggedIn) {
            navLinks = navLinks.filter(function(link) {
                return !link.requiresLogin;
            })
        }

        if (!profile.get("is_staff")) {
            navLinks = navLinks.filter(function(link) {
                return !link.requiresStaff;
            })
        }

        return navLinks.map((link) => {
            //We need to only trigger the toggle menu on small screen sizes to avoid buggy behavior when selecting menu items on larger screens
            var smScreen = (this.state.windowWidth < 768);
            var toggleMenu = smScreen ? {
                toggle: "collapse",
                target: ".navbar-collapse"
            } : {
                toggle: null,
                target: null
            };

            return (
            <li key={link.name} data-toggle={toggleMenu.toggle} data-target={toggleMenu.target}>
                <Link to={link.linksTo}
                      activeClassName="active">
                    <i className={"glyphicon glyphicon-" + link.icon}></i>
                    {link.name}
                </Link>
            </li>
            );
        });
    },

    render: function() {
        let profile = this.props.profile;
        let loggedIn = hasLoggedInUser(profile);

        let loginLogoutDropdown = loggedIn
            ? <LogoutLink username={profile.get("username")} />
            : <LoginLink/>;

        let homeTarget = loggedIn ? "dashboard" : "images";

        return (
        <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <MaintenanceMessageBanner maintenanceMessages={this.props.maintenanceMessages} />
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
                    <Link
                        style={{
                            maxWidth: "130px",
                            maxHeight: "51px",
                            marginRight: "50px",
                            float: "left",
                            padding: "9px 0"
                        }}
                        to={ homeTarget }>
                        <img
                            src={ logoPath }
                            width="100%"
                        />
                    </Link>
                </div>
                <div className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                        {this.renderNavLinks()}
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

export default Header;
