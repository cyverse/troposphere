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
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {

        if (this.props.applications.isEmpty()) {
          return (
            <div>
              <em>No results found.</em>
            </div>
          );
        } else {

          var featuredApplicationArray = this.props.applications.filter(function (app) {
            return app.get('featured');
          });
          var featuredApplications = new ApplicationCollection(featuredApplicationArray);

          return (
            <div>
              <ApplicationCardList key="featured" title="Featured Search Results" applications={featuredApplications}/>,
              <ApplicationCardList key="searchResults" title="Search Results" applications={this.props.applications}/>
            </div>
          );
        }
      }

    });

  });
