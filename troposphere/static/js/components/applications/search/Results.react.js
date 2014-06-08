/** @jsx React.DOM */

define(
  [
    'react',
    'actions/ApplicationActions',
    'stores/ApplicationStore',
    '../list/ApplicationCardList.react'
  ],
  function (React, ApplicationActions, ApplicationStore, ApplicationCardList) {

    return React.createClass({

      getInitialState: function () {
        return {
          apps: ApplicationStore.getResults(this.props.query)
        };
      },

      updateResults: function () {
        if (this.isMounted()) {
          this.setState({
            apps: ApplicationStore.getResults(this.props.query)
          });
        }
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateResults);
        if (!this.state.apps) ApplicationActions.search(this.props.query);
      },

      componentDidUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateResults);
      },

      componentWillReceiveProps: function (nextProps) {
        this.setState({apps: null});
        var results = ApplicationStore.getResults(nextProps.query);
        if (results) {
          this.setState({apps: results});
        } else {
          ApplicationActions.search(nextProps.query);
        }
      },

      render: function () {
        if (!this.state.apps) {
          return (
            <div className="loading"></div>
          );
        } else if (this.state.apps.isEmpty()) {
          return (
            <div>
              <em>No results found.</em>
            </div>
          );
        } else {
          return (
            <ApplicationCardList applications={this.state.apps}/>
          );
        }
      }

    });

  });
