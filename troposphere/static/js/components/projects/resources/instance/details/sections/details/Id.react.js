
import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';

export default React.createClass({
    displayName: "Id",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        return (
          <ResourceDetail label="ID">
            {this.props.instance.id}
          </ResourceDetail>
        );
    }

});
