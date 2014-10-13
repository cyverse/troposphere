/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'components/common/SecondaryNavigation.react',
    'collections/ApplicationCollection',
    './ApplicationCardList.react',
    './SearchContainer.react',
    'stores/ApplicationStore',
    'stores/TagStore'
  ],
  function (React, PageHeader, SecondaryNavigation, ApplicationCollection, ApplicationCardList, ApplicationSearch, ApplicationStore, TagStore) {

    function getState() {
      return {
        applications: ApplicationStore.getAll(),
        tags: TagStore.getAll()
      };
    }

    return React.createClass({

      getInitialState: function () {
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateState);
        TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
        TagStore.removeChangeListener(this.updateState);
      },

      getRoutes: function(){
        return [
          {
            name: "Search",
            href: "/application/images"
          },
          {
            name: "Favorites",
            href: "/application/images/favorites"
          },
          {
            name: "My Images",
            href: "/application/images/authored"
          }
        ];
      },

      renderFeaturedImages: function(){
        if (this.state.applications && this.state.tags) {
          var featuredApplicationArray = this.state.applications.filter(function (app) {
            return app.get('featured');
          });
          var featuredApplications = new ApplicationCollection(featuredApplicationArray);

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
        var applications = this.state.applications;
        var tags = this.state.tags;

        if (applications && tags) {
          return (
            <ApplicationCardList key="all"
                                 title="All Images"
                                 applications={applications}
                                 tags={tags}
            />
          );
        } else {
          return (
            <div className="loading"></div>
          );
        }
      },

      render: function () {
        var routes = this.getRoutes();

        return (
          <div className="container">
            <SecondaryNavigation title="Images" routes={routes} currentRoute="search"/>
            <ApplicationSearch/>
            {this.renderFeaturedImages()}
            {this.renderImages()}
          </div>
        );

      }

    });

  });
