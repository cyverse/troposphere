
define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({
      displayName: "Size",

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <span style={{textTransform: "capitalize"}}>{this.props.volume.get('size') + " GB"}</span>
        );
      }

    });

  });
