import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import Time from 'components/common/Time.react';


export default React.createClass({
    displayName: "LaunchDate",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        return (
          <ResourceDetail label="Launched">
            <Time date={this.props.instance.get('start_date')}/>
          </ResourceDetail>
        );
    }

});
