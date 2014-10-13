/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions/ApplicationActions',
    'stores/ApplicationStore',
    '../list/ApplicationCardList.react',
    'collections/ApplicationCollection'
  ],
  function (React, Backbone, ApplicationActions, ApplicationStore, ApplicationCardList, ApplicationCollection) {

    return React.createClass({

      propTypes: {
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderFeaturedImages: function(){
        var featuredApplicationArray = this.props.applications.filter(function (app) {
          return app.get('featured');
        });
        var featuredApplications = new ApplicationCollection(featuredApplicationArray);

        if(featuredApplications.length > 0) {
          return (
            <ApplicationCardList key="featured"
                                 title="Featured Images"
                                 applications={featuredApplications}
                                 tags={this.props.tags}
            />
          );
        }
      },

      renderImages: function(){
        if (this.props.applications.isEmpty()) {
          return (
            <em>No results found.</em>
          );
        }

        return (
          <ApplicationCardList key="searchResults"
                               title="Search Results"
                               applications={this.props.applications}
                               tags={this.props.tags}
          />
        );
      },

      render: function () {
        return (
          <div>
            {this.renderFeaturedImages()}
            {this.renderImages()}
          </div>
        );
      }

    });

  });
