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

        return (
          <header className="clearfix">
            <a href="/" id="logo">
              <img src="/assets/images/mini_logo.png" alt="iPlant Cloud Services" height="30" width="30"/>
              <span>Atmosphere </span>
              <span id="tagline">iPlant Cloud Services</span>
            </a>
            <div id="header-nav">
                {rightChild}
            </div>
          </header>
        );
      }
    });

    return Header;

  });
