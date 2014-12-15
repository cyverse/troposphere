/** @jsx React.DOM */

define(
  [
    'react',
    '../common/ApplicationCard.react'
  ],
  function (React, ApplicationCard) {

    return React.createClass({

      propTypes: {
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onLoadMoreImages: React.PropTypes.func,
        totalNumberOfApplications: React.PropTypes.number
      },

      renderCard: function(application){
        return (
          <li key={application.id}>
            <ApplicationCard application={application}
                             tags={this.props.tags}/>
          </li>
        );
      },

      render: function () {
        var applications = this.props.applications;
        var totalNumberOfApplications = this.props.totalNumberOfApplications;
        var appCards = applications.map(this.renderCard);

        var loadMoreImagesButton;
        if(applications.models.length < totalNumberOfApplications) {
          loadMoreImagesButton = (
            <button style={{"margin": "auto", "display": "block"}} className="btn btn-default" onClick={this.props.onLoadMoreImages}>
              Show more images...
            </button>
          )
        }

        return (
          <div>
            <h3>{this.props.title}</h3>
            <ul className='app-card-grid'>
              {appCards}
            </ul>
            {loadMoreImagesButton}
          </div>
        );
      }

    });

  });
