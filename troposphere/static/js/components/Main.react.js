/** @jsx React.DOM */

define(function (require) {

    var React = require('react');
    var Header = require('./Header.react');
    var Sidebar = require('./Sidebar.react');
    var Footer = require('./Footer.react');
    var Notifications = require('./Notifications.react');
    var Profile = require('controllers/profile');
    var Settings = require('./Settings.react');
    var Projects = require('./projects/List.react');
    var ApplicationList = require('./applications/ApplicationsHome.react');
    var ApplicationFavorites = require('./applications/Favorites.react');
    var ApplicationDetail = require('./applications/ApplicationDetail.react');
    var ProviderController = require('controllers/providers');
    var Providers = require('./Providers.react');
    var Help = require('./Help.react');
    var InstanceDetail = require('./instances/InstanceDetail.react');
    var ReportInstance = require('./instances/Report.react');
    var VolumeDetail = require('./VolumeDetailWrapper.react');
    var ApplicationSearchResults = require('./applications/SearchResults.react');
    var InstanceCollection = require('collections/instances');
    var Instance = require('models/instance');
    var VolumeCollection = require('collections/volumes');
    var Volume = require('models/volume');
    var AppCollection = require('collections/applications');
    var Application = require('models/application');
    var ProjectController = require('controllers/projects');
    var NotificationController = require('controllers/notifications');

    return React.createClass({

      getInitialState: function () {
        return {
          loggedIn: this.props.session.isValid(),
          profile: null,
          route: null,
          routeArgs: [],
          providers: null,
          identities: null,
          instances: new InstanceCollection(),
          volumes: new VolumeCollection(),
          applications: new AppCollection()
        };
      },

      componentDidMount: function () {

      },

      handleNavigate: function (route, options) {
        //this.router.navigate(route, options);
        console.log(route);
        this.setState({route: route});
      },

      fetchProjects: function () {
        ProjectController.get().then().then(function (projects) {
          this.setState({projects: projects});

          projects.on('change add remove', function () {
            this.setState({projects: projects});
          }.bind(this));
        }.bind(this));
      },

      pages: {
        projects: function () {
          return (
            <Projects projects={this.state.projects} onRequestProjects={this.fetchProjects}/>
          );
        }
      },

      renderContent: function () {
        if (this.state.route){
          //return this.pages[this.state.route];
          return this.pages.projects.apply(this);
        }
        return (
          <div></div>
        );
      },

      render: function () {
        return (
          <div>
            <Header profile={this.state.profile}/>
            <Sidebar loggedIn={this.state.loggedIn}
                     currentRoute={this.state.route}
                     onNavigate={this.handleNavigate}/>
            <Notifications/>
            <div id='main'>
              {this.props.content}
            </div>
            <Footer/>
          </div>
        );
      }

    });

  });
