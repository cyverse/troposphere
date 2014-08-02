/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    './list/SearchContainer.react',
    './search/SearchResults.react',
    'stores/ApplicationStore'
  ],
  function (React, SecondaryApplicationNavigation, SearchContainer, SearchResults, ApplicationStore) {

    function getState(query) {
      return {
        applications: ApplicationStore.getSearchResultsFor(query)
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
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
      },

      componentWillReceiveProps: function (nextProps) {
        this.setState(getState(nextProps.query));
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
