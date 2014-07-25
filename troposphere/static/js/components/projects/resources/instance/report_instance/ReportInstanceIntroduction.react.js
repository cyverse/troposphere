/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Glyphicon.react'
  ],
  function (React, Backbone, Glyphicon) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <p className="alert alert-info">
            <Glyphicon name="info-sign"/>
            {" Is instance "}
            <code>{this.props.instance.get('name')}</code>
            {" exhibiting unexpected behavior? Please read about "}
            <a href="https://pods.iplantcollaborative.org/wiki/x/Blm">using instances</a>
            {" or "}
            <a href="https://pods.iplantcollaborative.org/wiki/x/p55y">troubleshooting instances</a>
            {" for answers to common problems before submitting a request to support staff."}
          </p>
        );
      }
    });

  });
