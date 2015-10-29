import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';

export default React.createClass({
    displayName: "IpAddress",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        return (
          <ResourceDetail label="IP Address">
            {this.props.instance.get('ip_address')}
          </ResourceDetail>
        );
    }
});
