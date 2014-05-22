/** @jsx React.DOM */

define(
  [
    'react',

    '../common/Rating.react',
    './Tags.react',
    '../common/ApplicationCard.react',

    'modal',
    'components/applications/launch_modal',
    './MachineList.react',
    'controllers/profile',
    'controllers/providers'
  ],
  function (React, Rating, Tags, ApplicationCard, Modal, LaunchModal, MachineList, Profile, ProviderController) {

    return React.createClass({

      componentDidMount: function () {
        // Fetch identities (used in modal)
        Profile.getIdentities().then(function (identities) {
          this.setState({identities: identities});
        }.bind(this));

        // Fetch providers (used in modal)
        ProviderController.getProviders().then(function (providers) {
          this.setState({providers: providers});
        }.bind(this));
      },

      showModal: function (e) {
        Modal.show(
          <LaunchModal
            application={this.props.application}
            identities={this.state.identities}
            providers={this.state.providers}
          />
        );
      },

      render: function () {
        var app = this.props.application;

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
