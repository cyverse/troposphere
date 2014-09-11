/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Header.react',
    './Footer.react',
    'stores'
  ],
  function (React, Backbone, Header, Footer, stores) {

    return React.createClass({

      propTypes: {
        profile: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        route: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.array
        ])
      },

      render: function () {
        var maintenanceMessages = stores.MaintenanceMessageStore.getAll();
        var marginTop = maintenanceMessages.length * 24 + "px";

        return (
          <div>
            <Header profile={this.props.profile} currentRoute={this.props.route} maintenanceMessages={maintenanceMessages}/>
            <div id="main" style={{"margin-top": marginTop}}>
              {this.props.content}
            </div>
            <Footer profile={this.props.profile}/>
          </div>
        );
      }

    });

  });
