
define(
  [
    'react',
    'backbone',
    './header/HeaderView.react',
    './launch/ImageLaunchCard.react',
    'actions',
    './ViewApplicationDetails.react',
    './EditApplicationDetails.react',
    'modals'
  ],
  function (React, Backbone, HeaderView, ImageLaunchCard, actions, ViewApplicationDetails, EditApplicationDetails, modals) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function () {
        return {
          isEditing: false
        }
      },

      showLaunchModal: function (e) {
        modals.InstanceModals.launch(this.props.application);
      },

      handleEditImageDetails: function () {
        this.setState({isEditing: true})
      },

      handleSaveImageDetails: function (newAttributes) {
        var application = this.props.application;
        this.setState({isEditing: false});
        actions.ApplicationActions.updateApplicationAttributes(application, newAttributes);
      },

      handleCancelEditing: function () {
        this.setState({isEditing: false})
      },

      render: function () {
        var view;

        if (this.state.isEditing) {
          view = (
            <EditApplicationDetails application={this.props.application}
                                    tags={this.props.tags}
                                    providers={this.props.providers}
                                    identities={this.props.identities}
                                    onSave={this.handleSaveImageDetails}
                                    onCancel={this.handleCancelEditing}
              />
          )
        } else {
          view = (
            <ViewApplicationDetails application={this.props.application}
                                    tags={this.props.tags}
                                    providers={this.props.providers}
                                    identities={this.props.identities}
                                    onEditImageDetails={this.handleEditImageDetails}

              />
          )
        }
        return (
          <div id='app-detail' className="container">
            <div className="row">
              <div className="col-md-12">
                <HeaderView application={this.props.application}/>
              </div>
            </div>
            <div className="row image-content">
              <div className="col-md-9">
                {view}
              </div>
              <div className="col-md-3">
                <ImageLaunchCard application={this.props.application} onLaunch={this.showLaunchModal}/>
              </div>
            </div>

          </div>
        );
      }

    });

  });
