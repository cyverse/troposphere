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
