/** @jsx React.DOM */

define(
  [
    'react',
    './header/HeaderView.react',
    './availability/AvailabilityView.react',
    './tags/TagsView.react',
    './launch/ImageLaunchCard.react',
    './name/EditNameView.react',
    './description/EditDescriptionView.react',
    './versions/VersionsView.react',
    'actions/InstanceActions'
  ],
  function (React, HeaderView, AvailabilityView, TagsView, ImageLaunchCard, EditNameView, EditDescriptionView, VersionsView, InstanceActions) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
      },

      showModal: function (e) {
        InstanceActions.launch(this.props.application);
      },

      handleNameChange: function(e){
        console.log(e.target.value);
      },

      handleNameChange: function(e){
        console.log(e.target.value);
      },

      render: function () {
        var availabilityView, versionView;

        // Since providers requires authentication, we can't display which providers
        // the image is available on on the public page
        if(this.props.providers){
          availabilityView = (
            <AvailabilityView application={this.props.application}
                              providers={this.props.providers}
            />
          );
        }

        // Since identities requires authentication, we can't display the image
        // versions on the public page
        if(this.props.identities){
          versionView = (
            <VersionsView application={this.props.application}
                          identities={this.props.identities}
            />
          );
        }

        return (
          <div>
            <div className="edit-link-row">
              <a className="edit-link" onClick={this.props.onCancel}>Cancel</a>
            </div>
            <div>
              <EditNameView application={this.props.application} onChange={this.props.handleNameChange}/>
              <TagsView application={this.props.application} tags={this.props.tags}/>
              {availabilityView}
              <EditDescriptionView application={this.props.application} onChange={this.props.handleDescriptionChange}/>
              {versionView}
            </div>
          </div>
        );
      }

    });

  });
