define(function(require) {

  var React = require('react'),
      Backbone = require('backbone'),
      actions = require('actions'),
      MaintenanceMessageBanner = require('./MaintenanceMessageBanner.react'),
      Router = require('react-router'),

      // plugin: required to enable the drop-down, but not used directly
      bootstrap = require('bootstrap');

  var Link = Router.Link;

  var links = [
    {
      name: "Dashboard",
      linksTo: "dashboard",
      href: "/application/dashboard",
      icon: "stats",
      requiresLogin: true
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
    }
  ];

  var LoginLink = React.createClass({
    render: function () {
      return (
        <li className="dropdown">
          <a href="/login?redirect=/application?beta=true">Login</a>
        </li>
      );
    }
  });

  var LogoutLink = React.createClass({

    propTypes: {
      username: React.PropTypes.string.isRequired
    },

    onShowVersion: function(e){
      e.preventDefault();
      actions.VersionActions.showVersion();
    },

    render: function () {
      return (
        <li className="dropdown">
          <a className="dropdown-toggle" href="#" data-toggle="dropdown">
            {this.props.username}
            <b className="caret"></b>
          </a>
          <ul className="dropdown-menu">
            <li>
                <Link to="settings">Settings</Link>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#" onClick={this.onShowVersion}>Version</a>
            </li>
            <li>
              <a href="http://atmosphere.status.io" target="_blank">Status</a>
            </li>
            <li>
              <a href="/logout?cas=True">Sign out</a>
            </li>
          </ul>
        </li>
      );
    }
  });

  var Header = React.createClass({

    propTypes: {
      profile: React.PropTypes.instanceOf(Backbone.Model),
      currentRoute: React.PropTypes.array.isRequired
    },

    renderBetaToggle: function(){
      if(!window.show_troposphere_only){
        return (
          <li>
            <a className="beta-toggle" href="/application?beta=false">
              <div className="toggle-wrapper">
                <div className="toggle-background">
                  <div className="toggle-text">View Old UI</div>
                </div>
                <div className="toggle-switch"></div>
              </div>
            </a>
          </li>
        )
      }
    },

    render: function () {

      var profile = this.props.profile;
      var loginLogoutDropdown = profile ? <LogoutLink username={profile.get('username')}/> : <LoginLink/>;

      if(!profile) {
        links = links.filter(function (link) {
          return !link.requiresLogin;
        })
      }

      var navLinks = links.map(function(link){
        var isCurrentRoute = (link.name.toLowerCase() === this.props.currentRoute[0]);
        var className = isCurrentRoute ? "active" : null;
        return (
          <li key={link.name}>
            <Link to={link.linksTo}>
              <i className={"glyphicon glyphicon-" + link.icon}></i>
              {link.name}
            </Link>
          </li>
        );
      }.bind(this));

      var brandLink;
      if(profile){
        brandLink = <Link to="dashboard" className="navbar-brand"/>;
      }else{
        brandLink = <Link to="images" className="navbar-brand"/>;
      }

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
                {this.renderBetaToggle()}
                {loginLogoutDropdown}
              </ul>
            </div>
          </div>
        </div>
      );

    }
  });

  return Header;

});
