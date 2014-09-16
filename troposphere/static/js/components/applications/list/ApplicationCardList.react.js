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

      render: function () {
        var applications = this.props.applications;
        var numberOfResults = this.state.page*this.state.resultsPerPage;
        var apps = applications.first(numberOfResults);

        var appCards = apps.map(function (app) {
          return (
            <li key={app.id}>
              <ApplicationCard application={app}
                               tags={this.props.tags}/>
            </li>
          );
        }.bind(this));

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
