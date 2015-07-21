define(function (require) {

  var React = require('react'),
    ApplicationCard = require('../common/ApplicationCard.react');

  return React.createClass({

    propTypes: {
      title: React.PropTypes.string,
      applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    renderTitle: function () {
      var title = this.props.title;
      if (!title) return;

      return (
        <h3>{title}</h3>
      )
    },

    renderCard: function (application) {
      return (
        <li key={application.id}>
          <ApplicationCard
            application={application}
            tags={this.props.tags}/>
        </li>
      );
    },

    render: function () {
      var applications = this.props.applications,
        appCards = applications.map(this.renderCard);

      return (
        <div>
          {this.renderTitle()}
          <ul className='app-card-grid'>
            {appCards}
          </ul>
        </div>
      );
    }

  });

});
