import React from 'react/addons';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';

export default React.createClass({
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
