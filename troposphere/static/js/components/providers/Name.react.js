import React from 'react';
import Backbone from 'backbone';
import Router from 'react-router';


export default React.createClass({
    displayName: "Name",

    propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        let provider = this.props.provider;
        return (
            <div className="row">
                <h1>{provider.get('name')}</h1>
                <Router.Link className=" btn btn-default" to = "all-providers" >
                <span className="glyphico glyphicon-arrow-left"> </span>
                {" Back to All Providers" }
                </Router.Link>
            </div>
        );

    }

});
