/** @jsx React.DOM */

define(
  [
    'react',
    './Header.react',
    './Footer.react'
  ],
  function (React, Header, Footer) {

    return React.createClass({

      getInitialState: function () {
        return {
          loggedIn: this.props.session.isValid()
        };
      },

      render: function () {

        var footer = (
          true ? <Footer/> : null
        );

        return (
          <div>
            <Header profile={this.props.profile} currentRoute={this.props.route}/>
            <div id="main">
              {this.props.content}
            </div>
            {footer}
          </div>
        );
      }

    });

  });
