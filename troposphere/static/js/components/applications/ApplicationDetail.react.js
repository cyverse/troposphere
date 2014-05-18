define(
  [
    'react',

    './Rating.react',
    './Tags.react',
    './ApplicationCard.react',

    'modal',
    'components/applications/launch_modal',
    './MachineList.react'
  ],
  function (React, Rating, Tags, ApplicationCard, Modal, LaunchModal, MachineList) {

    return React.createClass({

      componentDidMount: function () {
        if (!this.props.application) this.props.onRequestApplication();
        if (!this.props.identities) this.props.onRequestIdentities();
      },

      showModal: function (e) {
        Modal.show(
          <LaunchModal
            application={this.props.application}
            identities={this.props.identities}
            providers={this.props.providers}
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
            //<Rating rating={app.get('rating')}/>
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
