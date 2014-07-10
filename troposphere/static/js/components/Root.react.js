/** @jsx React.DOM */

define(
  [
    'react',
    './Header.react',
    './sidebar/Sidebar.react',
    './Footer.react'
  ],
  function (React, Header, Sidebar, Footer) {

    return React.createClass({

      getInitialState: function () {
        return {
          loggedIn: this.props.session.isValid()
        };
      },

      render: function () {

        var sidebar = (
          false ?
          <Sidebar loggedIn={this.state.loggedIn}
                   currentRoute={this.props.route}
          />
          : null
        );

        var footer = (
          false ? <Footer/> : null
        );

        return (
          <div>
            <Header profile={this.props.profile}/>
            {sidebar}
            <div id="main" className="container">
              {this.props.content}
            </div>
            {footer}
          </div>
        );
      }

    });

  });
