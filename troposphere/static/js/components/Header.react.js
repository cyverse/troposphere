/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions/VersionActions'
  ],
  function (React, Backbone, VersionActions) {

    var links = [
      {
        name: "Dashboard",
        href: "/application/dashboard",
        requiresLogin: true
      },
      {
        name: "Projects",
        href: "/application/projects",
        requiresLogin: true
      },
      {
        name: "Images",
        href: "/application/images",
        requiresLogin: false
      },
      {
        name: "Providers",
        href: "/application/providers",
        requiresLogin: true
      },
      {
        name: "Help",
        href: "/application/help",
        requiresLogin: false
      }
    ];

    var LoginLink = React.createClass({
      render: function () {
        return (
          <li className="dropdown">
            <a href="/login">Login</a>
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
        VersionActions.showVersion();
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
                <a href="/logout?cas=True">Sign out</a>
              </li>
            </ul>
          </li>
        );
      }
    });

    var Header = React.createClass({

      propTypes: {
        profile: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {

        var profile = this.props.profile;
        var loginLogoutDropdown = profile ? LogoutLink({username: profile.get('username')}) : LoginLink();

        if(!profile) {
          links = links.filter(function (link) {
            return !link.requiresLogin;
          })
        }

        var navLinks = links.map(function(link){
          var isCurrentRoute = (link.name.toLowerCase() === this.props.currentRoute[0]);
          var className = isCurrentRoute ? "active" : null;
          return (
            <li key={link.name} className={className}><a href={link.href}>{link.name}</a></li>
          );
        }.bind(this));

        return (
          <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container">

              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">
                  Atmosphere
                </a>
              </div>

              <div className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                  {navLinks}
                </ul>
                <ul className="nav navbar-nav navbar-right">
                  <li>
                    <a href="/cf2">
                      <img src="/resources/images/beta_on.png" style={{"width":"82px"}}/>
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
