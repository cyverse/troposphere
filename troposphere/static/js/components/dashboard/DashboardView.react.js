/** @jsx React.DOM */

define(
  [
    'react',
    './HeaderView.react'
  ],
  function (React, HeaderView) {

    return React.createClass({

      propTypes: {
        //application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div id='app-detail'>
            <HeaderView application={this.props.application}/>
          </div>
        );
      }

    });

  });
