/** @jsx React.DOM */

define(
  [
    'react',
    './header/HeaderView.react',
    './availability/AvailabilityView.react',
    './tags/TagsView.react',
    './launch/ImageLaunchCard.react',
    './name/EditNameView.react',
    './created/CreatedView.react',
    './author/AuthorView.react',
    './description/EditDescriptionView.react',
    './versions/VersionsView.react',
    'actions/InstanceActions'
  ],
  function (React, HeaderView, AvailabilityView, TagsView, ImageLaunchCard, EditNameView, CreatedView, AuthorView, EditDescriptionView, VersionsView, InstanceActions) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
      },

      getInitialState: function(){
        var image = this.props.application;

        return {
          name: image.get('name'),
          description: image.get('description')
        }
      },

      showModal: function (e) {
        InstanceActions.launch(this.props.application);
      },

      handleSave: function(){
        var updatedAttributes = {
          name: this.state.name,
          description: this.state.description
        };

        this.props.onSave(updatedAttributes);
      },

      handleNameChange: function(e){
        var name = e.target.value;
        console.log(name);
        this.setState({name: name});
      },

      handleDescriptionChange: function(e){
        var description = e.target.value;
        console.log(description);
        this.setState({description: description});
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
              <a className="edit-link" onClick={this.handleSave}>Save</a>
            </div>
            <div>
              <EditNameView application={this.props.application} value={this.state.name} onChange={this.handleNameChange}/>
              <CreatedView application={this.props.application}/>
              <AuthorView application={this.props.application}/>
              <TagsView application={this.props.application} tags={this.props.tags}/>
              {availabilityView}
              <EditDescriptionView application={this.props.application} value={this.state.description} onChange={this.handleDescriptionChange}/>
              {versionView}
            </div>
          </div>
        );
      }

    });

  });
