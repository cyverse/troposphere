/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions/ApplicationActions',
    'stores/ApplicationStore',
    '../list/list/ApplicationCardList.react',
    '../list/grid/ApplicationCardGrid.react',
    'collections/ApplicationCollection'
  ],
  function (React, Backbone, ApplicationActions, ApplicationStore, ApplicationCardList, ApplicationCardGrid, ApplicationCollection) {

    return React.createClass({

      propTypes: {
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        query: React.PropTypes.string.isRequired
      },

      getInitialState: function(){
        return {
          viewType: 'list',
          resultsPerPage: 20,
          page: 1
        }
      },

      onLoadMoreImages: function(){
        this.setState({page: this.state.page + 1})
      },

      onChangeViewType: function(){
        if(this.state.viewType === "list"){
          this.setState({viewType: 'grid'});
        }else{
          this.setState({viewType: 'list'});
        }
      },

      renderFeaturedImages: function(){
        var featuredApplicationArray = this.props.applications.filter(function (app) {
          return app.get('featured');
        });
        var featuredApplications = new ApplicationCollection(featuredApplicationArray);

        if(featuredApplications.length > 0) {
          if(this.state.viewType === "list") {
            return (
              <ApplicationCardList key="featured"
                                   title="Featured Images"
                                   applications={featuredApplications}
                                   tags={this.props.tags}
                                   onLoadMoreImages={this.onLoadMoreImages}
                                   totalNumberOfApplications={featuredApplications.models.length}
              />
            );
          }else{
            return (
              <ApplicationCardGrid key="featured"
                                   title="Featured Images"
                                   applications={featuredApplications}
                                   tags={this.props.tags}
                                   onLoadMoreImages={this.onLoadMoreImages}
                                   totalNumberOfApplications={featuredApplications.models.length}
              />
            );
          }
        }
      },

      renderImages: function(){
        var numberOfResults = this.state.page*this.state.resultsPerPage;
        var totalNumberOfApplications = this.props.applications.models.length;
        var applications = this.props.applications.first(numberOfResults);
        applications = new ApplicationCollection(applications);
        var tags = this.props.tags;

        if (applications.isEmpty()) {
          return (
            <em>No results found.</em>
          );
        }

        if(this.state.viewType === "list") {
          return (
            <ApplicationCardList key="searchResults"
                                 title="Search Results"
                                 applications={applications}
                                 tags={tags}
                                 onLoadMoreImages={this.onLoadMoreImages}
                                 totalNumberOfApplications={totalNumberOfApplications}
            />
          );
        }else{
          return (
            <ApplicationCardGrid key="searchResults"
                                 title="Search Results"
                                 applications={applications}
                                 tags={tags}
                                 onLoadMoreImages={this.onLoadMoreImages}
                                 totalNumberOfApplications={totalNumberOfApplications}
            />
          );
        }
      },

      renderListButton: function(){
        var classValues = "btn btn-default";
        if(this.state.viewType === "list") classValues += " active";

        return (
          <button type="button" className={classValues} onClick={this.onChangeViewType}>
            <span className="glyphicon glyphicon-align-justify"></span> List
          </button>
        );
      },

      renderGridButton: function(){
        var classValues = "btn btn-default";
        if(this.state.viewType === "grid") classValues += " active";

        return (
          <button type="button" className={classValues} onClick={this.onChangeViewType}>
            <span className="glyphicon glyphicon-th"></span> Grid
          </button>
        );
      },

      renderResultsTitleAndToggles: function(){
        var numberOfResults = this.state.page*this.state.resultsPerPage;
        var applications = this.props.applications;
        var numberOfDisplayedApplications = applications.first(numberOfResults).length;

        var title = "Showing " + numberOfDisplayedApplications + " of " + applications.models.length + " results for " + '"' + this.props.query + '"';
        return (
          <div className="display-toggles clearfix">
            <h3>{title}</h3>
            <div className="btn-group pull-right">
              {this.renderListButton()}
              {this.renderGridButton()}
            </div>
          </div>
        );
      },

      render: function () {
        return (
          <div>
            {this.renderResultsTitleAndToggles()}
            {this.renderFeaturedImages()}
            {this.renderImages()}
          </div>
        );
      }

    });

  });
