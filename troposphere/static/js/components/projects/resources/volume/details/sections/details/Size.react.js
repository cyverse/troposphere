define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    ResourceDetail = require('components/projects/common/ResourceDetail.react');

  return React.createClass({
    displayName: "Size",

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume;

      return (
        <ResourceDetail label="Size">
          {volume.get('size') + " GB"}
        </ResourceDetail>
      );
    }

  });

});
