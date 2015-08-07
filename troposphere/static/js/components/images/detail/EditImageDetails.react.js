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

      var imageTags = stores.TagStore.getImageTags(image);
      return {
        name: image.get('name'),
        description: image.get('description'),
        tags: imageTags
      }
    },

    handleSave: function () {
      var updatedAttributes = {
        name: this.state.name,
        description: this.state.description,
        tags: this.state.tags
      };

      this.props.onSave(updatedAttributes);
    },

    handleNameChange: function (e) {
      var name = e.target.value;
      this.setState({name: name});
    },

    handleDescriptionChange: function (e) {
      var description = e.target.value;
      this.setState({description: description});
    },

    onTagAdded: function(tag){
      tags = this.state.tags
      tags.add(tag)
      this.setState({tags: tags});
    },

    onTagRemoved: function(tag){
      tags = this.state.tags
      tags.remove(tag)
      this.setState({tags: tags});
    },

    render: function () {
      var image = this.props.image,
          providers = this.props.providers,
          identities = this.props.identities,
          allTags = this.props.tags,
          imageTags = this.state.tags;

      // Since providers requires authentication, we can't display which providers
      // the image is available on on the public page

      return (
        <div>
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
          <div className="edit-link-row clearfix">
            <a className="btn btn-primary btn-sm pull-right" onClick={this.handleSave}>Save</a>
            <a className="btn btn-default btn-sm pull-right"  onClick={this.props.onCancel}>Cancel</a>
          </div>
        </div>
      );
    }

  });

});
