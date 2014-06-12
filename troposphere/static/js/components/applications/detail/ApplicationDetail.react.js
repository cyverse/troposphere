/** @jsx React.DOM */

define(
  [
    'react',
    './Tags.react',
    '../common/ApplicationCard.react',
    './MachineList.react',
    'controllers/ProfileController',
    'stores/ApplicationStore',
    'stores/ProviderStore',
    'actions/InstanceActions',
    'stores/IdentityStore'
  ],
  function (React, Tags, ApplicationCard, MachineList, ProfileController, ApplicationStore, ProviderStore, InstanceActions, IdentityStore) {

    function getStoreState(applicationId) {
        return {
          application: ApplicationStore.get(applicationId),
          providers: ProviderStore.getAll()
        };
    }

    return React.createClass({

      getInitialState: function() {
        return getStoreState(this.props.applicationId);
      },

      componentDidMount: function () {
        // Fetch identities (used in modal)
        ProfileController.getIdentities().then(function (identities) {
          if (this.isMounted()) this.setState({identities: identities});
        }.bind(this));

        ApplicationStore.addChangeListener(this.updateStoreState);
        ProviderStore.addChangeListener(this.updateStoreState);
      },

      componentDidUnmount: function() {
        ApplicationStore.removeChangeListener(this.updateStoreState);
        ProviderStore.removeChangeListener(this.updateStoreState);
      },

      updateStoreState: function() {
        if (this.isMounted()) this.setState(getStoreState(this.props.applicationId))
      },

      showModal: function (e) {
        var identities = IdentityStore.getAll();
        var providers = ProviderStore.getAll();

        if(identities && providers) {
          InstanceActions.launch(this.state.application, identities, providers);
        }
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
