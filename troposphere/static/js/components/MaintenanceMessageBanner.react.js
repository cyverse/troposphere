/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores'
  ],
  function (React, Backbone, stores) {

    return React.createClass({

      propTypes: {
        maintenanceMessages: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderMessage: function(message){
        return (
          <li className="message">
            <strong>iPlant Cloud - Tucson</strong>
            {" is currently under maintenance.  You will not be able to launch anything in it until maintenance is completed."}
          </li>
        )
      },

      render: function () {

//        <li className="message"><strong>iPlant Cloud - Tucson</strong> is currently under maintenance.  You will not be able to launch anything in it until maintenance is completed.</li>
//            <li className="message"><strong>iPlant Cloud - Tucson</strong> is currently under maintenance.  You will not be able to launch anything in it until maintenance is completed.</li>
//            <li className="message"><strong>iPlant Cloud - Tucson</strong> is currently under maintenance.  You will not be able to launch anything in it until maintenance is completed.</li>
//
        return (
          <ul className="message-banner">
            {this.props.maintenanceMessages.map(this.renderMessage)}
          </ul>
        );
      }

    });

  });
