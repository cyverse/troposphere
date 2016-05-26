import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import Status from 'components/projects/detail/resources/tableData/volume/Status.react';

export default React.createClass({
        displayName: "Status",
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
