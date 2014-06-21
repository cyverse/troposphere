/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ApplicationStore',
    './detail/ApplicationDetailsView.react'
  ],
  function (React, ApplicationStore, ApplicationDetailsView) {

    function getState(applicationId) {
        return {
          application: ApplicationStore.get(applicationId)
        };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        applicationId: React.PropTypes.string.isRequired
      },

      getInitialState: function() {
        return getState(this.props.applicationId);
      },

      updateState: function() {
        if (this.isMounted()) this.setState(getState(this.props.applicationId))
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function() {
        ApplicationStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var application = this.state.application;

        if (application) {
          return (
            <ApplicationDetailsView application={this.state.application}/>
          );
        }else{
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
