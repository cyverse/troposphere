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
          <span>{external_link.get('title')}</span>
        );
      }

      return (
        <Router.Link
            to="project-link-details"
            params={{
                projectId: this.getParams().projectId,
                linkId: external_link.id
            }}>
          {external_link.get('title')}
        </Router.Link>
      );
    }
});
