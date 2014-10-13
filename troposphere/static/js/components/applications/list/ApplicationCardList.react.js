/** @jsx React.DOM */

define(
  [
    'react',
    '../common/ApplicationListCard.react'
  ],
  function (React, ApplicationCard) {

    return React.createClass({

      propTypes: {
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function(){
        return {
          resultsPerPage: 20,
          page: 1
        }
      },

      onLoadMoreImages: function(){
        this.setState({page: this.state.page + 1})
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
        var numberOfResults = this.state.page*this.state.resultsPerPage;
        var apps = applications.first(numberOfResults);
        var appCards = apps.map(this.renderCard);

        var loadMoreImagesButton;
        if(numberOfResults < applications.models.length) {
          loadMoreImagesButton = (
            <button style={{"margin": "auto", "display": "block"}} className="btn btn-default" onClick={this.onLoadMoreImages}>
              Show more images...
            </button>
          )
        }

        return (
          <div>
            <h3>{this.props.title}</h3>
            <ul className='app-card-list'>
              {appCards}
            </ul>
            {loadMoreImagesButton}
          </div>
        );
      }

    });

  });
