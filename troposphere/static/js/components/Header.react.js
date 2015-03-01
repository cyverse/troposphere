/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions',
    './MaintenanceMessageBanner.react',
    'react-router',

    // required to enable the drop-down
    'bootstrap'
  ],
  function (React, Backbone, actions, MaintenanceMessageBanner, Router) {

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
                  <a href="/application/settings">Settings</a>
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
          //return (
          //  <li key={link.name} className={className}>
          //    <a href={link.href}>
          //      <i className={"glyphicon glyphicon-" + link.icon}></i>
          //      {link.name}
          //    </a>
          //  </li>
          //);
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
