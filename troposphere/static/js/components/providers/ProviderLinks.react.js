import React from 'react';
import Backbone from 'backbone';
import Router from 'react-router';

var RouteHandler = Router.RouteHandler;

export default React.createClass({

    render: function () {
        var listItems = this.props.listItems.map(function(item) {
            return (
                <li>
                    <Router.Link to="provider" params={{providerId: item.attributes.id}}>
                        {item.attributes.name}
                    </Router.Link>
                </li>
            )
        });
      return (
          <ul className= {this.props.className} >
            {listItems}
          </ul>
      );
    }

});
