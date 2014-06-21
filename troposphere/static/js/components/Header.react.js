/** @jsx React.DOM */

define(
  [
    'react',
    'actions/VersionActions'
  ],
  function (React, VersionActions) {

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

      onShowVersion: function(e){
        e.preventDefault();
        VersionActions.showVersion();
      },

      render: function () {
        return (
          <li className="dropdown">
            <a className="dropdown-toggle" href="#" data-toggle="dropdown">jchansen
              <b className="caret"></b>
            </a>
            <ul className="dropdown-menu">
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

      render: function () {

        var profile = this.props.profile;
        var loginLogoutLink = profile ? LogoutLink({username: profile.get('username')}) : LoginLink();

        return (
          <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container-fluid">

              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">
                  Atmosphere: iPlant Cloud Services
                </a>
              </div>

              <div className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-right">
                  {loginLogoutLink}
                </ul>
              </div>
            </div>
          </div>
        );

      }
    });

    return Header;

  });
