/** @jsx React.DOM */

define(
  [
    'react',
    'components/applications/detail/availability/AvailabilityView.react',
    'components/applications/detail/tags/TagsView.react',
    'components/applications/detail/description/DescriptionView.react',
    'components/applications/detail/versions/VersionsView.react'
  ],
  function (React, AvailabilityView, TagsView, DescriptionView, VersionsView) {

    return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderAvailability: function(){
        if(this.props.providers){
          return (
            <AvailabilityView application={this.props.image}
                              providers={this.props.providers}
            />
          );
        }
      },

      renderVersions: function(){
        // Since identities requires authentication, we can't display the image
        // versions on the public page
        if(this.props.identities){
          return (
            <VersionsView application={this.props.image}
                          identities={this.props.identities}
            />
          );
        }
      },

      render: function () {
        return (
          <div id="app-detail">
            <div className="image-content">
              <div className="image-header">
                <h1>{this.props.image.get('name')}</h1>
              </div>
              <TagsView application={this.props.image} tags={this.props.tags}/>
              {this.renderAvailability()}
              <DescriptionView application={this.props.image}/>
              {this.renderVersions()}
            </div>
          </div>
        );
      }

    });

  });
