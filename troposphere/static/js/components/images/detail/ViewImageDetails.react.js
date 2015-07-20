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
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onEditImageDetails: React.PropTypes.func.isRequired,
      },

      renderEditLink: function(){
        var profile = stores.ProfileStore.get(),
            image = this.props.image;

        if(profile.id && profile.get('username') === image.get('created_by').username){
          return (
            <div className="edit-link-row">
              <a className="edit-link" onClick={this.props.onEditImageDetails}>Edit details</a>
            </div>
          )
        }
      },

      render: function () {
        var availabilityView, versionView, tagsView;

        // Since providers requires authentication, we can't display which providers
        // the image is available on on the public page
        if(this.props.providers){
          availabilityView = (
            <AvailabilityView image={this.props.image}
                              providers={this.props.providers}
            />
          );
        }
        tagsView = (
            <TagsView image={this.props.image}
                      tags={this.props.tags}
            />
        )
        // Since identities requires authentication, we can't display the image
        // versions on the public page
        if(this.props.identities){
          versionView = (
            <VersionsView image={this.props.image} />
          );
        }

        return (
          <div>
            {this.renderEditLink()}
            <div>
              <NameView image={this.props.image}/>
              <CreatedView image={this.props.image}/>
              <AuthorView image={this.props.image}/>
              <DescriptionView image={this.props.image}/>
              {tagsView}
              {availabilityView}
              {versionView}
            </div>
          </div>
        );
      }

    });

  });
