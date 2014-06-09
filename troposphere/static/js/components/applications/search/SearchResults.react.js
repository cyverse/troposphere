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

//      componentWillReceiveProps: function (nextProps) {
//        this.setState({apps: null});
//        var results = ApplicationStore.getResults(nextProps.query);
//        if (results) {
//          this.setState({apps: results});
//        } else {
//          ApplicationActions.search(nextProps.query);
//        }
//      },

      render: function () {
        if (this.props.applications.isEmpty()) {
          return (
            <div>
              <em>No results found.</em>
            </div>
          );
        } else {
          return (
            <ApplicationCardList applications={this.props.applications}/>
          );
        }
      }

    });

  });
