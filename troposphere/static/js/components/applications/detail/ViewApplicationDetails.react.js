/** @jsx React.DOM */

define(
  [
    'react',
    './header/HeaderView.react',
    './availability/AvailabilityView.react',
    './tags/TagsView.react',
    './launch/ImageLaunchCard.react',
    './name/NameView.react',
    './description/DescriptionView.react',
    './versions/VersionsView.react',
    'actions/InstanceActions'
  ],
  function (React, HeaderView, AvailabilityView, TagsView, ImageLaunchCard, NameView, DescriptionView, VersionsView, InstanceActions) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      showModal: function (e) {
        InstanceActions.launch(this.props.application);
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
              <a className="edit-link">Edit details</a>
            </div>
            <div>
              <NameView application={this.props.application}/>
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
