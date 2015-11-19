import React from 'react';
import Backbone from 'backbone';
import Router from 'react-router';

var RouteHandler = Router.RouteHandler;

export default React.createClass({

    render: function () {
        // Component API
        var ulClass = this.props.ulClass;
        var liClass = this.props.liClass;
        var linkTarget = this.props.linkTarget;
        var listData = this.props.listData;


        var ListItems = this.props.listData.map(function(item) {
            return (
                <li className = {liClass} key = {item.attributes.id} >
                    <Router.Link to = "provider" params = {{id: item.attributes.id}}>
                        {item.attributes.name}
                    </Router.Link>
                </li>
            )
        });

        return (
            <ul className= {ulClass} >
                {ListItems}
            </ul>
        );
    }

});
