/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ApplicationStore',
    'stores/ProviderStore',
    './detail/ApplicationDetailsView.react'
  ],
  function (React, ApplicationStore, ProviderStore, ApplicationDetailsView) {

    function getState(applicationId) {
        return {
          application: ApplicationStore.get(applicationId),
          providers: ProviderStore.getAll()
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
        ProviderStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function() {
        ApplicationStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var application = this.state.application;
        var providers = this.state.providers;

        if (application && providers) {
          return (
            <ApplicationDetailsView
              application={this.state.application}
              providers={this.state.providers}
            />
          );
        }else{
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
