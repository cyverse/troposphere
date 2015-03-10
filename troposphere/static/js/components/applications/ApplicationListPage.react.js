/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    'collections/ApplicationCollection',
    './list/SearchContainer.react',
    'stores',
    './list/ApplicationListView.react'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationCollection, ApplicationSearch, stores, ApplicationListView) {

    function getState() {
      return {
        applications: stores.ApplicationStore.getAll(),
        tags: stores.TagStore.getAll(),
        isLoadingMoreResults: false
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
        stores.ApplicationStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
      },

      render: function () {
        return (
          <ApplicationListView
            applications={this.state.applications}
            tags={this.state.tags}
          />
        );
      }

    });

  });
