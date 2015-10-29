
import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
    displayName: "Name",

    propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        var provider = this.props.provider;
        return (
          <div className="row">
            <h2>{provider.get('name')}</h2>
          </div>
        );

    }

});
