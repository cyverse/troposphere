import React from 'react/addons';
import Backbone from 'backbone';
import Router from 'react-router';
import stores from 'stores';

var RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "ProvidersMaster",

    render: function () {
        return(
            <section className = "container provider-master" >
                <RouteHandler/>
            </section>
        )
    }

});
