/** @jsx React.DOM */

define(
  [
    'react',
    './Tags.react',
    '../common/ApplicationCard.react',
    './MachineList.react',
    'stores/ApplicationStore',
    'actions/InstanceActions'
  ],
  function (React, Tags, ApplicationCard, MachineList, ApplicationStore, InstanceActions) {

    function getState(applicationId) {
        return {
          application: ApplicationStore.get(applicationId)
        };
    }

    return React.createClass({

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

      showModal: function (e) {
        InstanceActions.launch(this.state.application);
      },

      render: function () {
        var application = this.state.application;

        if (!application) {
          return (
            <div className='loading'></div>
          );
        }

        return (
          <div id='app-detail'>
            <a className='nav-back btn btn-default'>
              <span className='glyphicon glyphicon-arrow-left'>{''}</span>
            </a>
            <h1>{application.get('name_or_id')}</h1>
            <h2 className='tag-title'>Image Tags</h2>
            <a href='#'>Suggest a Tag</a>
            <Tags tags={application.get('tags')}/>
            <hr/>
            <ApplicationCard application={application} onLaunch={this.showModal}/>
            <h2>Description</h2>
            <p>{application.get('description')}</p>
            <hr/>
            <h2>Versions of this Image</h2>
            <MachineList machines={application.get('machines')}/>
          </div>
        );
      }

    });

  });
