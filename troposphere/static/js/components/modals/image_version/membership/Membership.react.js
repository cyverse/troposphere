import React from 'react';
import ReactDOM from 'react-dom';
import Backbone from 'backbone';
import $ from 'jquery';
import Router from 'react-router';

export default React.createClass({
    displayName: "Membership",

    propTypes: {
      membership: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      renderLinks: React.PropTypes.bool
    },

    getDefaultProps: function(){
      return {
        renderLinks: true
      }
    },

    componentDidMount: function(){
      var el = ReactDOM.findDOMNode(this),
          $el = $(el),
          membership = this.props.membership;

      $el.tooltip({
        title: membership.get('name')
      });
    },

    onClick: function(){
      Router.getInstance().transitionTo("search", {}, {q: this.props.membership.get('name')});
    },

    render: function () {
      var membership = this.props.membership,
          membershipName = membership.get('name'),
          link;

      if(this.props.renderLinks){
        link = (
          <Router.Link to="search" query={{q: membershipName}}>
            {membershipName}
          </Router.Link>
        );
      }else{
        link = (
          <a href="javascript:void(0)">{membershipName}</a>
        )
      }

      return (
        <li className="membership">
          {link}
        </li>
      );

    }
});
