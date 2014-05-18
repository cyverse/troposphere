define(
  [
    'react',
    'models/application',
    'collections/applications',
    'components/applications/cards',
    'jquery',
    'components/common/Time.react',
    'modal',
    'components/applications/launch_modal',
    './Machine.react',
    './MachineList.react'
  ],
  function (React, App, AppCollection, Cards, $, Time, Modal, LaunchModal, Machine, MachineList) {

    var ApplicationDetail = React.createClass({
      componentDidMount: function () {
        if (!this.props.application)
          this.props.onRequestApplication();
        if (!this.props.identities)
          this.props.onRequestIdentities();
      },
      showModal: function (e) {
        Modal.show(LaunchModal({
          application: this.props.application,
          identities: this.props.identities,
          providers: this.props.providers
        }));
      },
      render: function () {
        var app = this.props.application;

        if (!app)
          return React.DOM.div({className: 'loading'});

        return React.DOM.div({id: 'app-detail'},
          React.DOM.a({className: 'nav-back btn btn-default'}, React.DOM.span({className: 'glyphicon glyphicon-arrow-left'}, '')),
          React.DOM.h1({}, app.get('name_or_id')),
          React.DOM.h2({className: 'tag-title'}, 'Image Tags'),
          React.DOM.a({href: '#'}, 'Suggest a Tag'),
          Cards.Tags({ tags: app.get('tags') }),
          React.DOM.hr({}),
          //Cards.Rating({rating: app.get('rating')}),
          Cards.ApplicationCard({application: app, onLaunch: this.showModal}),
          React.DOM.h2({}, "Description"),
          React.DOM.p({}, app.get('description')),
          React.DOM.hr({}),
          React.DOM.h2({}, "Versions of this Image"),
          MachineList({machines: app.get('machines')}))
      }
    });

    return ApplicationDetail;
  });
