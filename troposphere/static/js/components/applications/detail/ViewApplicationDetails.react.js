/** @jsx React.DOM */

define(
  [
    'react',
    './header/HeaderView.react',
    './availability/AvailabilityView.react',
    './tags/TagsView.react',
    './launch/ImageLaunchCard.react',
    './name/NameView.react',
    './created/CreatedView.react',
    './author/AuthorView.react',
    './description/DescriptionView.react',
    './versions/VersionsView.react',
    'actions',
    'stores'
  ],
  function (React, HeaderView, AvailabilityView, TagsView, ImageLaunchCard, NameView, CreatedView, AuthorView, DescriptionView, VersionsView, actions, stores) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onEditImageDetails: React.PropTypes.func.isRequired
      },

      renderEditLink: function(){
        var profile = stores.ProfileStore.get(),
            image = this.props.application;

        if(profile.id && profile.get('username') === image.get('created_by').username){
          return (
            <div className="edit-link-row">
              <a className="edit-link" onClick={this.props.onEditImageDetails}>Edit details</a>
            </div>
          )
        }
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
            <VersionsView application={this.props.application}/>
          );
        }

        return (
          <div>
            {this.renderEditLink()}
            <div>
              <NameView application={this.props.application}/>
              <CreatedView application={this.props.application}/>
              <AuthorView application={this.props.application}/>
              <TagsView application={this.props.application} tags={this.props.tags}/>
              {availabilityView}
              <DescriptionView application={this.props.application}/>
              {versionView}
            </div>
          </div>
        );
      }

    });

  });
