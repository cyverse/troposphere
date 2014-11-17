/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'context',
    './Header.react',
    './Footer.react',
    'stores',
    'actions/NullProjectActions'
  ],
  function (React, Backbone, context, Header, Footer, stores, NullProjectActions) {

    return React.createClass({

      propTypes: {
        profile: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        route: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.array
        ])
      },

      componentDidMount: function () {
        if(context.nullProject){
          if(!context.nullProject.isEmpty()){
            NullProjectActions.migrateResourcesIntoProject(context.nullProject);
          }else{
            NullProjectActions.moveAttachedVolumesIntoCorrectProject();
          }
        }
      },

      render: function () {
        var maintenanceMessages = new Backbone.Collection();
        if(this.props.profile) {
          maintenanceMessages = stores.MaintenanceMessageStore.getAll();
        }
        var marginTop = maintenanceMessages.length * 24 + "px";

        return (
          <div>
            <Header profile={this.props.profile} currentRoute={this.props.route} maintenanceMessages={maintenanceMessages}/>
            <div id="main" style={{"marginTop": marginTop}}>
              {this.props.content}
            </div>
            <Footer profile={this.props.profile}/>
          </div>
        );
      }

    });

  });
