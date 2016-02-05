define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    ResourceDetail = require('components/projects/common/ResourceDetail.react'),
    Status = require('components/projects/detail/resources/tableData/volume/Status.react');

  return React.createClass({
      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },
      render: function() {
          return (
              <ResourceDetail label="Status">
                  <Status volume={ this.props.volume }/>
              </ResourceDetail>
          );
      }
  });

});
