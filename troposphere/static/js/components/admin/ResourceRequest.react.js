import React from 'react/addons';
import Backbone from 'backbone';
import Router from 'react-router';
import stores from 'stores';

export default React.createClass({

    propTypes: {
      request: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var request = this.props.request;
      return (
        <tr>
          <td className="user-name">
            <Router.Link to="resource-request" params={{resourceRequestId: request.id}}>
              {request.get('user').username}
            </Router.Link>
          </td>
          <td className="request">{request.get('request')}</td>
          <td className="description">{request.get('description')}</td>
        </tr>
      );
    }
});
