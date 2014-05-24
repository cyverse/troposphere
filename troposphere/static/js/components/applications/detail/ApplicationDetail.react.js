/** @jsx React.DOM */

define(
  [
    'react',

    '../common/Rating.react',
    './Tags.react',
    '../common/ApplicationCard.react',

    'modal',
    './launch_modal',
    './MachineList.react',
    'controllers/profile',
    'controllers/providers',
    'stores/applications'
  ],
  function (React, Rating, Tags, ApplicationCard, Modal, LaunchModal, MachineList, Profile, ProviderController, ApplicationStore) {

    return React.createClass({

      getInitialState: function() {
        return {
          application: ApplicationStore.get(this.props.applicationId)
        };
      },

      componentDidMount: function () {
        // Fetch identities (used in modal)
        Profile.getIdentities().then(function (identities) {
          if (this.isMounted())
            this.setState({identities: identities});
        }.bind(this));

        // Fetch providers (used in modal)
        ProviderController.getProviders().then(function (providers) {
          if (this.isMounted())
            this.setState({providers: providers});
        }.bind(this));

        ApplicationStore.addChangeListener(this.updateApp);
      },

      componentDidUnmount: function() {
        ApplicationStore.removeChangeListener(this.updateApp);
      },

      updateApp: function() {
        if (this.isMounted())
          this.setState({
            application: ApplicationStore.get(this.props.applicationId)
          });
      },

      showModal: function (e) {
        Modal.show(
          <LaunchModal
            application={this.state.application}
            identities={this.state.identities}
            providers={this.state.providers}
          />
        );
      },

      render: function () {
        var app = this.state.application;

        if (!app) {
          return (
            <div className='loading'></div>
            );
        }

        return (
          <div id='app-detail'>
            <a className='nav-back btn btn-default'>
              <span className='glyphicon glyphicon-arrow-left'>{''}</span>
            </a>
            <h1>{app.get('name_or_id')}</h1>
            <h2 className='tag-title'>Image Tags</h2>
            <a href='#'>Suggest a Tag</a>
            <Tags tags={app.get('tags')}/>
            <hr/>
            <Rating rating={app.get('rating')}/>
            <ApplicationCard application={app} onLaunch={this.showModal}/>
            <h2>Description</h2>
            <p>{app.get('description')}</p>
            <hr/>
            <h2>Versions of this Image</h2>
            <MachineList machines={app.get('machines')}/>
          </div>
        );
      }

    });

  });
