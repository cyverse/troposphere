/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    'collections/ApplicationCollection',
    './list/ApplicationCardList.react',
    './list/SearchContainer.react',
    'stores/ApplicationStore',
    'stores/TagStore',
    './list/ApplicationListView.react'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationCollection, ApplicationCardList, ApplicationSearch, ApplicationStore, TagStore, ApplicationListView) {

    function getState() {
      return {
        applications: ApplicationStore.getAll(),
        tags: TagStore.getAll(),
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
        ApplicationStore.addChangeListener(this.updateState);
        TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
        TagStore.removeChangeListener(this.updateState);
      },

      onLoadMoreImages: function(){
        this.setState({isLoadingMoreResults: true});
        ApplicationStore.fetchMore();
      },

      renderImages: function(){
        if (this.state.applications && this.state.tags) {
          return (
            <ApplicationListView applications={this.state.applications}
                                 tags={this.state.tags}
            />
          );
        }

        return (
          <div className="loading"></div>
        );
      },

      render: function () {
        return (
          <div>
            <SecondaryApplicationNavigation currentRoute="search"/>
            <div className="container application-card-view">
              <ApplicationSearch/>
              {this.renderImages()}
            </div>
          </div>
        );

      }

    });

  });
