/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    var LoginLink = React.createClass({
      render: function () {
        return <a href="/login">Login</a>;
      }
    });

    var LogoutLink = React.createClass({
      render: function () {
        return <a href="/logout?cas=True">{"Logout " + this.props.username}</a>;
      }
    });

    var Header = React.createClass({
      render: function () {

        var profile = this.props.profile;
        var rightChild = profile ? LogoutLink({username: profile.get('username')}) : LoginLink();

//        return (
//          <header className="clearfix">
//            <a href="/" id="logo">
//              <img src="/assets/images/mini_logo.png" alt="iPlant Cloud Services" height="30" width="30"/>
//              <span>Atmosphere </span>
//              <span id="tagline">iPlant Cloud Services</span>
//            </a>
//            <div id="header-nav">
//                {rightChild}
//            </div>
//          </header>
//        );

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
                <ul className="nav navbar-nav">
                  <li className="">
                    <a href="#">Dashboard</a>
                  </li>
                </ul>

                <ul className="nav navbar-nav navbar-right">
                  <li className="dropdown">
                    <a className="dropdown-toggle" href="#" data-toggle="dropdown">jchansen
                      <b className="caret"></b>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a href="/version">Version</a>
                      </li>
                      <li>
                        <a href="/logout">Sign out</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      }
    });

    return Header;

  });
