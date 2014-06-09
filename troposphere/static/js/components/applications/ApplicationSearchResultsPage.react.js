/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'collections/ApplicationCollection',
    './list/ApplicationListView.react',
    'stores/ApplicationStore'
  ],
  function (React, PageHeader, ApplicationCollection, ApplicationListView, ApplicationStore) {

    function getState() {
      return {
        applications: ApplicationStore.getSearchResultsFor(this.props.query)
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

      componentDidUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
      },

      render: function () {
        var content;
        if (!this.state.applications) {
          content = (
            <div className="loading"></div>
          );
        } else {
          content = (
            <Results applications={this.state.applications}/>
          );
        }

        return (
          <div>
            <PageHeader title="Image Search"/>
            <SearchBox query={this.props.query}/>
            {content}
          </div>
        );

      }

    });

  });
