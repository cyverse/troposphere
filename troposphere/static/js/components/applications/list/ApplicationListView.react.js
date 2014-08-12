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

      render: function () {
        var content;
        if (this.state.applications && this.state.tags) {
          var featuredApplicationArray = this.state.applications.filter(function (app) {
            return app.get('featured');
          });
          var featuredApplications = new ApplicationCollection(featuredApplicationArray);

          content = [
            <ApplicationCardList key="featured"
                                 title="Featured Images"
                                 applications={featuredApplications}
                                 tags={this.props.tags}
            />,
            <ApplicationCardList key="all"
                                 title="All Images"
                                 applications={this.state.applications}
                                 tags={this.props.tags}
            />
          ];
        } else {
          content = (
            <div className="loading"></div>
          );
        }

        var routes = [
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

        var currentRoute = "search";

        return (
          <div className="container">
            <SecondaryNavigation title="Images" routes={routes} currentRoute={currentRoute}/>
            <ApplicationSearch/>
            {content}
          </div>
        );

      }

    });

  });
