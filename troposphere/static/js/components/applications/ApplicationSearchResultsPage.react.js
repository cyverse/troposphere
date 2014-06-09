/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './list/SearchContainer.react',
    './search/Results.react',
    'stores/ApplicationStore'
  ],
  function (React, PageHeader, SearchContainer, SearchResults, ApplicationStore) {

    function getState(query) {
      return {
        applications: ApplicationStore.getSearchResultsFor(query)
      };
    }

    return React.createClass({

      getInitialState: function () {
        return getState(this.props.query);
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState(this.props.query));
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateState);
      },

      componentDidUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
      },

      render: function () {
        var content;
        if (!this.state.applications) {
          content = (
            <div className="loading"></div>
          );
        } else if (this.state.applications.isEmpty()) {
          content = (
            <p>No images found matching that search.</p>
          );
        }else {
          content = (
            <SearchResults applications={this.state.applications}/>
          );
        }

        return (
          <div>
            <PageHeader title="Image Search"/>
            <SearchContainer query={this.props.query}/>
            {content}
          </div>
        );

      }

    });

  });
