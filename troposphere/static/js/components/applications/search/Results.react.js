/** @jsx React.DOM */

define(
  [
    'react',
    'actions/applications',
    'stores/applications',
    '../list/ApplicationCardList.react'
  ],
  function (React, AppActions, AppStore, ApplicationCardList) {

    return React.createClass({

      getInitialState: function() {
        return {
          apps: AppStore.getResults(this.props.query)
        };
      },

      updateResults: function() {
        this.setState({
          apps: AppStore.getResults(this.props.query)
        });
      },

      componentDidMount: function() {
        AppStore.addChangeListener(this.updateResults);
        if (!this.state.apps)
          AppActions.search(this.props.query);
      },

      componentDidUnmount: function() {
        AppStore.removeChangeListener(this.updateResults);
      },

      componentWillReceiveProps: function(nextProps) {
        this.setState({apps: null});
        var results = AppStore.getResults(nextProps.query);
        if (results)
          this.setState({apps: results});
        else
          AppActions.search(nextProps.query);
      },

      render: function () {
        if (!this.state.apps) {
          return (
            <div class="loading"></div>
          );
        } else if (this.state.apps.isEmpty()) {
          return (
            <div>
              <em>No results found.</em>
            </div>
          );
        } else{
          return (
            <ApplicationCardList applications={this.state.apps}/>
          );
        }
      }

    });

  });
