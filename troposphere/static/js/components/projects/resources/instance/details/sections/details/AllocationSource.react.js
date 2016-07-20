import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';

export default React.createClass({
    displayName: "Id",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        let sourceName;
        if (this.props.instance) {
            //TODO query source store for instance source
            sourceName = true ? "Group 1" : "loading...";
        }
        return (
          <ResourceDetail label="Allocation Source">
            { sourceName }
          </ResourceDetail>
        );
    }

});
