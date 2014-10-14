/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    './list/SearchContainer.react',
    './search/SearchResults.react',
    'stores/ApplicationStore',
    'stores/TagStore'
  ],
  function (React, SecondaryApplicationNavigation, SearchContainer, SearchResults, ApplicationStore, TagStore) {

    function getState(query) {
      return {
        applications: ApplicationStore.getSearchResultsFor(query),
        tags: TagStore.getAll()
      };
    }

    return React.createClass({

      propTypes: {
        query: React.PropTypes.string.isRequired
      },

      getInitialState: function () {
        return getState(this.props.query);
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState(this.props.query));
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateState);
        TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
        TagStore.removeChangeListener(this.updateState);
      },

      componentWillReceiveProps: function (nextProps) {
        this.setState(getState(nextProps.query));
      },

      render: function () {
        var content;
        if (this.state.applications && this.state.tags) {
          if (this.state.applications.isEmpty()) {
            content = (
              <p>No images found matching that search.</p>
            );
          }else {
            content = (
              <SearchResults applications={this.state.applications}
                             tags={this.state.tags}
                             query={this.props.query}
              />
            );
          }

        } else {
          content = (
            <div className="loading"></div>
          );
        }

        return (
          <div>
            <SecondaryApplicationNavigation currentRoute="search"/>
            <div className="container application-card-view">
              <SearchContainer query={this.props.query}/>
              {content}
            </div>
          </div>
        );

      }

    });

  });
