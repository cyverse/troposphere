/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {

      },

      render: function () {
        return (
          <div className="button-bar" style={{padding: "17px 0px"}}>
            <a style={{color: "#333"}} href="#">{"Resources > "}</a>
            <span style={{color: "#56AA21"}}>{"Instance Name"}</span>
          </div>
        );
      }

    });

  });
