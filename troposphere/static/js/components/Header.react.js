import React from "react";
import Backbone from "backbone";
import modals from "modals";
import MaintenanceMessageBanner from "./MaintenanceMessageBanner.react";
import context from "context";
import globals from "globals";
import Router from "react-router";

import NotificationController from "controllers/NotificationController";
import { trackAction } from "utilities/userActivity";
import { hasLoggedInUser } from "utilities/profilePredicate";

let Link = Router.Link;

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
    {
        name: "Providers",
        linksTo: "providers",
        href: "/application/providers",
        icon: "cloud",
        requiresLogin: true
    },
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
];

let LoginLink = React.createClass({
    render: function() {
        let redirect_path = window.location.pathname + "?beta=true";

        return (
        <li className="dropdown">
            <a id="login_link" href={ "/login?redirect_to=" + redirect_path }>Login</a>
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
        var statusPageEl,
            username = this.props.username,
            badgeLink;

        if (!username && window.show_public_site) {
            username = "AnonymousUser"
        }
        if (globals.STATUS_PAGE_LINK) {
            statusPageEl = (
                <li>
                    <a href={ globals.STATUS_PAGE_LINK } target="_blank">Status</a>
                </li>
            );
        }

        let trackSettings = () => {
            trackAction("viewed-settings", {});
        };

        let trackRequests = () => {
            trackAction("viewed-requests", {});
        };

        if (globals.BADGES_ENABLED) {
            badgeLink = (
                <li>
                    <Link to="my-badges"> Badges
                    </Link>
                </li>
            );
        }

        return (
        <li className="dropdown">
            <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                { username } <b className="caret"></b></a>
            <ul className="dropdown-menu">
                <li>
                    <Link to="settings" onClick={ trackSettings }> Settings
                    </Link>
                </li>
                <li>
                    <Link to="my-requests-resources" onClick={ trackRequests }> My requests
                    </Link>
                </li>
                <li className="divider"></li>
                { badgeLink }
                <li>
                    <a id="version_link" href="#" onClick={ this.onShowVersion }>Version</a>
                </li>
                { statusPageEl }
                <li>
                    <a id="logout_link" href="/logout?force=true&airport_ui=false">Sign out</a>
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
            NotificationController.warning(
                "CyVerse Maintenance Information",
                context.getMaintenanceNotice(),
                {
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

    renderBetaToggle: function() {

        if (!window.show_troposphere_only) {

            let trackEvent = (e) => {
                trackAction("switch-ui", {
                    user_interface: "troposphere-to-airport"
                });
                trackAction("switch-to-airport");
            };

            return (
            <div className="beta-toggle">
                <a href="/application?beta=false&airport_ui=true" onClick={ trackEvent }>
                    <div className="toggle-wrapper">
                        <div className="toggle-background">
                            <div className="toggle-text"> View Old UI </div>
                        </div>
                        <div className="toggle-switch"></div>
                    </div>
                </a>
            </div>
            )
        }
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
            var toggleMenu = smScreen ? {toggle: 'collapse',target:'.navbar-collapse'} : {toggle: null, target: null};

            return (
            <li key={ link.name } data-toggle={ toggleMenu.toggle } data-target={ toggleMenu.target }>
                <Link to={ link.linksTo }>
                <i className={ "glyphicon glyphicon-" + link.icon }></i>
                { link.name }
                </Link>
            </li>
            );
        });
    },

    render: function() {
        var profile = this.props.profile,
            loggedIn = hasLoggedInUser(profile);

        var loginLogoutDropdown = (loggedIn ?
            <LogoutLink username={ profile.get("username") } /> :
            <LoginLink/>);

        var brandLink = (loggedIn ?
            <Link to="dashboard" className="navbar-brand" /> :
            <Link to="images" className="navbar-brand" />);

        return (
        <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <MaintenanceMessageBanner maintenanceMessages={ this.props.maintenanceMessages } />
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
                    { brandLink }
                </div>
                <div className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                        { this.renderNavLinks() }
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        { loginLogoutDropdown }
                    </ul>
                    { loggedIn ? this.renderBetaToggle() : null }
                </div>
            </div>
        </div>
        );

    }
});

export default Header;
