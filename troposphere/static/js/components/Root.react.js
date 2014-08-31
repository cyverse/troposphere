/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Header.react',
    './Footer.react'
  ],
  function (React, Backbone, Header, Footer) {

    return React.createClass({

      propTypes: {
        profile: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        route: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.array
        ])
      },

      render: function () {
        return (
          <div>
            <Header profile={this.props.profile} currentRoute={this.props.route}/>
            <div id="main">
              {this.props.content}
            </div>
            <Footer profile={this.props.profile}/>
          </div>
        );
      }

    });

  });
