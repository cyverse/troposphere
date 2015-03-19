define(function (require) {

  var React = require('react'),
      HeaderView = require('./header/HeaderView.react'),
      AvailabilityView = require('./availability/AvailabilityView.react'),
      EditTagsView = require('./tags/EditTagsView.react'),
      ImageLaunchCard = require('./launch/ImageLaunchCard.react'),
      EditNameView = require('./name/EditNameView.react'),
      CreatedView = require('./created/CreatedView.react'),
      AuthorView = require('./author/AuthorView.react'),
      EditDescriptionView = require('./description/EditDescriptionView.react'),
      VersionsView = require('./versions/VersionsView.react'),
      actions = require('actions');

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
      actions.InstanceActions.launch(this.props.application);
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
      this.setState({name: name});
    },

    handleDescriptionChange: function(e){
      var description = e.target.value;
      this.setState({description: description});
    },

    onTagAdded: function(tags){
      alert("ImageTag actions not connected");
      //this.setState({tags: tags});
    },

    onTagRemoved: function(tags){
      alert("ImageTag actions not connected");
      //this.setState({tags: tags});
    },

    render: function () {
      var application = this.props.application,
          providers = this.props.providers,
          identities = this.props.identities,
          allTags = this.props.tags,
          imageTags = stores.ImageTagStore.getAllFor(application),
          availabilityView,
          versionView;

      // Since providers requires authentication, we can't display which providers
      // the image is available on on the public page
      if(providers){
        availabilityView = (
          <AvailabilityView
            application={application}
            providers={providers}
          />
        );
      }

      // Since identities requires authentication, we can't display the image
      // versions on the public page
      if(identities){
        versionView = (
          <VersionsView application={application}/>
        );
      }

      return (
        <div>
          <div className="edit-link-row">
            <a className="edit-link" onClick={this.props.onCancel}>Cancel</a>
            <a className="edit-link" onClick={this.handleSave}>Save</a>
          </div>
          <div>
            <EditNameView
              application={application}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <CreatedView application={application}/>
            <AuthorView application={application}/>
            <EditTagsView
              application={application}
              tags={allTags}
              value={imageTags}
              onTagAdded={this.onTagAdded}
              onTagRemoved={this.onTagRemoved}
            />
            {availabilityView}
            <EditDescriptionView
              application={application}
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
            {versionView}
          </div>
        </div>
      );
    }

  });

});
