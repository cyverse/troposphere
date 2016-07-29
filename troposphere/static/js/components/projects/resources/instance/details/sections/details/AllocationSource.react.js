import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import stores from 'stores';

export default React.createClass({
    displayName: "Id",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        let sourceName;
        if (this.props.instance) {
            sourceName = true ? stores.AllocationSourceStore[2].name : "loading...";
        }

        return (
          <ResourceDetail label="Allocation Source">
            { sourceName }
          </ResourceDetail>
        );
    }

});
