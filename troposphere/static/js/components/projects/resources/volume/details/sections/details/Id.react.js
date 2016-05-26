import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';

export default React.createClass({
    displayName: "Id",

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
