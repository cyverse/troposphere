import React from 'react';
import Backbone from 'backbone';
import Router from 'react-router';


export default React.createClass({

    mixins: [Router.State],

    propTypes: {
      external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var external_link = this.props.external_link;

      if (!external_link.id) {
        return (
          <span>{external_link.get('link')}</span>
        );
      }

      return (
        <a href={external_link.get('link')} target="_blank">
          {external_link.get('link')}
        </a>
      );
    }
});
