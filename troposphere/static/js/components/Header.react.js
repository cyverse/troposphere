import React from 'react/addons';
import Backbone from 'backbone';
import actions from 'actions';
import modals from 'modals';
import MaintenanceMessageBanner from './MaintenanceMessageBanner.react';
import globals from 'globals';
import Router from 'react-router';
// plugin: required to enable the drop-down, but not used directly
import bootstrap from 'bootstrap';

import { hasLoggedInUser } from 'utilities/profilePredicate';

let Link = Router.Link;

let links = [
    {
      name: "Dashboard",
      linksTo: "dashboard",
      href: "/application/dashboard",
      icon: "stats",
      requiresLogin: true,
      isEnabled: true,
    },
    {
      name: "Projects",
      linksTo: "projects",
      href: "/application/projects",
      icon: "folder-open",
      requiresLogin: true,
      isEnabled: true
    },
    {
      name: "Images",
      linksTo: "images",
      href: "/application/images",
      icon: "floppy-disk",
      requiresLogin: false,
      isEnabled: true
    },
    {
      name: "Providers",
      linksTo: "providers",
      href: "/application/providers",
      icon: "cloud",
      requiresLogin: true,
      isEnabled: true
    },
    {
      name: "Help",
      linksTo: "help",
      href: "/application/help",
      icon: "question-sign",
      requiresLogin: false,
      isEnabled: true
    },
    {
      name: "Admin",
      linksTo: "admin",
      href: "/application/admin",
      icon: "cog",
      requiresLogin: true,
      requiresStaff: true,
      isEnabled: true
    },
    {
      name: "Badges",
      linksTo: "my-badges",
      href: "/application/badges",
      icon: "star",
      requiresLogin: true,
      requiresStaff: false,
      isEnabled: globals.BADGES_ENABLED
    }
];

let LoginLink = React.createClass({
    render: function () {
      return (
        <li className="dropdown">
          <a id="login_link" href="/login?redirect=/application?beta=true&airport_ui=false">Login</a>
        </li>
      );
    }
});

let LogoutLink = React.createClass({

    propTypes: {
      username: React.PropTypes.string.isRequired
    },

    onShowVersion: function (e) {
      e.preventDefault();
      modals.VersionModals.showVersion();
    },

    render: function () {
      var username = this.props.username;
      if (!username && show_public_site) {
          username = "AnonymousUser"
      }
      return (
        <li className="dropdown">
          <a className="dropdown-toggle" href="#" data-toggle="dropdown">
            {username}
            <b className="caret"></b>
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link to="settings">Settings</Link>
            </li>
            <li>
              <Link to="my-requests-resources">My requests</Link>
            </li>
            <li className="divider"></li>
            <li>
              <a id="version_link" href="#" onClick={this.onShowVersion}>Version</a>
            </li>
            <li>
              <a href="http://atmosphere.status.io" target="_blank">Status</a>
            </li>
            <li>
              <a id="logout_link" href="/logout?cas=True&airport_ui=false">Sign out</a>
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
        return {windowWidth: window.innerWidth};
    },

    handleResize: function(e) {
        this.setState({windowWidth: window.innerWidth});
    },

    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    },

    renderBetaToggle: function () {
      if (!window.show_troposphere_only) {
        return (
          <div className="beta-toggle">
            <a href="/application?beta=false&airport_ui=true">
              <div className="toggle-wrapper">
                <div className="toggle-background">
                  <div className="toggle-text">View Old UI</div>
                </div>
                <div className="toggle-switch"></div>
              </div>
            </a>
          </div>
        )
      }
    },

    render: function () {

      var profile = this.props.profile,
        hasLoggedInUser = hasLoggedInUser(profile);

      var loginLogoutDropdown = (hasLoggedInUser ?
            <LogoutLink username={profile.get('username')}/> :
            <LoginLink/>);

      if (!profile.get('selected_identity')) {
        links = links.filter(function (link) {
          return !link.requiresLogin && link.isEnabled;
        })
      } else {
        links = links.filter(function (link) {
          if (link.requiresStaff) return profile.get('is_staff');
          return link.isEnabled;
        })
      }

      var navLinks = links.map(function (link) {
        var isCurrentRoute = (link.name.toLowerCase() === this.props.currentRoute[0]);
        var className = isCurrentRoute ? "active" : null;

        //We need to only trigger the toggle menu on small screen sizes to avoid buggy behavior when selecting menu items on larger screens
        var smScreen = (this.state.windowWidth < 768);
        var toggleMenu = smScreen ? {toggle: 'collapse',target:'.navbar-collapse'} : {toggle: null, target: null};

        return (
          <li key={link.name} data-toggle={toggleMenu.toggle} data-target={toggleMenu.target} >
            <Link to={link.linksTo}>
              <i className={"glyphicon glyphicon-" + link.icon}></i>
              {link.name}
            </Link>
          </li>
        );
      }.bind(this));

      var brandLink = (hasLoggedInUser ?
        <Link to="dashboard" className="navbar-brand"/> :
        <Link to="images" className="navbar-brand"/>);

      return (
        <div className="navbar navbar-default navbar-fixed-top" role="navigation">
          <MaintenanceMessageBanner maintenanceMessages={this.props.maintenanceMessages}/>

          <div className="container">

            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              {brandLink}
            </div>

            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                {navLinks}
              </ul>
              <ul className="nav navbar-nav navbar-right">
                {loginLogoutDropdown}
              </ul>
            </div>
            {hasLoggedInUser ? this.renderBetaToggle() : null}
          </div>

        </div>
      );

    }
});

export default Header;

