/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions/ApplicationActions',
    'stores/ApplicationStore',
    '../list/ApplicationCardList.react',
    '../list/ApplicationCardGrid.react',
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
         viewType: 'list'
        }
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
              />
            );
          }else{
            return (
              <ApplicationCardGrid key="featured"
                                   title="Featured Images"
                                   applications={featuredApplications}
                                   tags={this.props.tags}
              />
            );
          }
        }
      },

      renderImages: function(){
        if (this.props.applications.isEmpty()) {
          return (
            <em>No results found.</em>
          );
        }

        if(this.state.viewType === "list") {
          return (
            <ApplicationCardList key="searchResults"
                                 title="Search Results"
                                 applications={this.props.applications}
                                 tags={this.props.tags}
            />
          );
        }else{
          return (
            <ApplicationCardGrid key="searchResults"
                                 title="Search Results"
                                 applications={this.props.applications}
                                 tags={this.props.tags}
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
        var title = "Showing (?) of " + this.props.applications.length + " results for " + '"' + this.props.query + '"';
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
