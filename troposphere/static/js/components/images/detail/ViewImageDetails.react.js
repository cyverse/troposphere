define(
  [
    'react',
    './header/HeaderView.react',
    './tags/TagsView.react',
    './launch/ImageLaunchCard.react',
    './name/NameView.react',
    './created/CreatedView.react',
    './removed/RemovedView.react',
    './author/AuthorView.react',
    './description/DescriptionView.react',
    './versions/VersionsView.react',
    'actions',
    'stores'
  ],
  function (React, HeaderView, TagsView, ImageLaunchCard, NameView, CreatedView, RemovedView, AuthorView, DescriptionView, VersionsView, actions, stores) {

    return React.createClass({
      displayName: "ViewImageDetails",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onEditImageDetails: React.PropTypes.func.isRequired
      },

      renderEditLink: function(){
        var profile = stores.ProfileStore.get(),
            image = this.props.image;

        if(profile.id && profile.get('username') === image.get('created_by').username || profile.get('is_staff')){
          return (
            <div className="edit-link-row clearfix">
              <a className="pull-right" onClick={this.props.onEditImageDetails}>
                <span className="glyphicon glyphicon-pencil"></span> Edit details</a>
            </div>
          )
        }
      },

      render: function () {
        var versionView, tagsView;

        tagsView = (
            <TagsView image={this.props.image}
                      tags={this.props.tags}
            />
        )

        return (
          <div>
            <div>
              <NameView image={this.props.image}/>
              <CreatedView image={this.props.image}/>
              <RemovedView image={this.props.image}/>
              <AuthorView image={this.props.image}/>
              <DescriptionView image={this.props.image}/>
              {tagsView}
            </div>
            {this.renderEditLink()}
          </div>
        );
      }

    });

});
