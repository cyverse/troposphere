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
        return (
          <div>
            <Header profile={this.props.profile}/>
            <Sidebar loggedIn={this.state.loggedIn}
                     currentRoute={this.props.route}
            />
            <div id='main'>
              {this.props.content}
            </div>
            <Footer/>
          </div>
        );
      }

    });

  });
