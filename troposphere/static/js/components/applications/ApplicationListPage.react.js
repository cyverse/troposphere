/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    'collections/ApplicationCollection',
    './list/ApplicationCardList.react',
    './list/SearchContainer.react',
    'stores/ApplicationStore'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationCollection, ApplicationCardList, ApplicationSearch, ApplicationStore) {

    function getState() {
      return {
        applications: ApplicationStore.getAll()
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
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
      },

      render: function () {
        var content;
        if (!this.state.applications) {
          content = (
            <div className="loading"></div>
          );
        } else {
          var featuredApplicationArray = this.state.applications.filter(function (app) {
            return app.get('featured');
          });
          var featuredApplications = new ApplicationCollection(featuredApplicationArray);

          content = [
            <ApplicationCardList key="featured" title="Featured Images" applications={featuredApplications}/>,
            <ApplicationCardList key="all" title="All Images" applications={this.state.applications}/>
          ];
        }

        return (
          <div className="container">
            <SecondaryApplicationNavigation currentRoute="search"/>
            <ApplicationSearch/>
            {content}
          </div>
        );

      }

    });

  });
