/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    './list/SearchContainer.react',
    './search/SearchResults.react',
    'stores'
  ],
  function (React, SecondaryApplicationNavigation, SearchContainer, SearchResults, stores) {

    function getState(query) {
      return {
        applications: stores.ApplicationStore.getSearchResultsFor(query),
        tags: stores.TagStore.getAll()
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
        stores.ApplicationStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
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
          <div className="container application-card-view">
            <SearchContainer query={this.props.query}/>
            {content}
          </div>
        );

      }

    });

  });
