
define(
  [
    'react',
    'backbone',
    './header/HeaderView.react',
    './launch/ImageLaunchCard.react',
    'actions',
    './ViewImageDetails.react',
    './EditImageDetails.react',
    './versions/VersionsView.react',
    'modals'
  ],
  function (React, Backbone, HeaderView, ImageLaunchCard, actions, ViewImageDetails, EditImageDetails, VersionsView, modals) {

    return React.createClass({
      displayName: "ImageDetailsView",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection),
        identities: React.PropTypes.instanceOf(Backbone.Collection),
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function () {
        return {
          isEditing: false
        }
      },

      showLaunchModal: function (e) {
        modals.InstanceModals.launch({ image: this.props.image, initialView: "BASIC_VIEW" });
      },

      handleEditImageDetails: function () {
        this.setState({isEditing: true})
      },

      handleSaveImageDetails: function(newAttributes){
        var image = this.props.image;
        actions.ImageActions.updateImageAttributes(image, newAttributes);
        this.setState({isEditing: false});
      },

      handleCancelEditing: function(){
        this.setState({isEditing: false});
      },

      render: function () {
        var view,
            versionView = (
                <VersionsView image={this.props.image}
            />
        );

        if(this.state.isEditing){
          view = (
            <EditImageDetails
                image={this.props.image}
                tags={this.props.tags}
                providers={this.props.providers}
                identities={this.props.identities}
                onSave={this.handleSaveImageDetails}
                onCancel={this.handleCancelEditing}
            />
          )
        } else {
          view = (
            <ViewImageDetails
                image={this.props.image}
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
                <HeaderView image={this.props.image}/>
              </div>
            </div>
            <div className="image-content">
              <div className="row">
                <div className="col-sm-8">
                  {view}
                </div>
                <div className="col-sm-4">
                  <ImageLaunchCard image={this.props.image} onLaunch={this.showLaunchModal}/>
                </div>
              </div>
              <div className="versionView">
                {versionView}
              </div>
            </div>

          </div>
        );
      }

    });

  });
