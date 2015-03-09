/** @jsx React.DOM */

define(
  [
    'react',
    '../common/ApplicationListCard.react'
  ],
  function (React, ApplicationListCard) {

    return React.createClass({

      propTypes: {
        title: React.PropTypes.string.isRequired,
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderCard: function(application){
        return (
          <li key={application.id}>
            <ApplicationListCard
              application={application}
              tags={this.props.tags}/>
          </li>
        );
      },

      render: function () {
        var applications = this.props.applications;
        var appCards = applications.map(this.renderCard);

        return (
          <div>
            <h3>{this.props.title}</h3>
            <ul className='app-card-list'>
              {appCards}
            </ul>
          </div>
        );
      }

    });

  });
