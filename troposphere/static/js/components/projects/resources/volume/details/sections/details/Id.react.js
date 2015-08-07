define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    ResourceDetail = require('components/projects/common/ResourceDetail.react');

  return React.createClass({

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume;

      return (
        <ResourceDetail label="ID">
          {volume.id}
        </ResourceDetail>
      );
    }
  });

});
