define(function (require) {

  var React = require('react'),
      HeaderView = require('./header/HeaderView.react'),
      EditTagsView = require('./tags/EditTagsView.react'),
      ImageLaunchCard = require('./launch/ImageLaunchCard.react'),
      EditNameView = require('./name/EditNameView.react'),
      EditDescriptionView = require('./description/EditDescriptionView.react'),
      CreatedView = require('./created/CreatedView.react'),
      AuthorView = require('./author/AuthorView.react'),
      actions = require('actions'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onSave: React.PropTypes.func.isRequired,
      onCancel: React.PropTypes.func.isRequired
    },

    getInitialState: function(){
      var image = this.props.image;

      return {
        name: image.get('name'),
        description: image.get('description')
      }
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
      var image = this.props.image,
          providers = this.props.providers,
          identities = this.props.identities,
          allTags = this.props.tags,
          imageTags = stores.TagStore.getImageTags(image);

      // Since providers requires authentication, we can't display which providers
      // the image is available on on the public page

      return (
        <div>
          <div className="edit-link-row">
            <a className="edit-link" onClick={this.props.onCancel}>Cancel</a>
            <a className="edit-link" onClick={this.handleSave}>Save</a>
          </div>
          <div>
            <EditNameView
              image={image}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <CreatedView image={image}/>
            <AuthorView image={image}/>
            <EditDescriptionView
              image={image}
              value={this.state.description}
              onChange={this.handleDescriptionChange}
                />
            <EditTagsView
              image={image}
              tags={allTags}
              value={imageTags}
              onTagAdded={this.onTagAdded}
              onTagRemoved={this.onTagRemoved}
            />
          </div>
        </div>
      );
    }

  });

});
