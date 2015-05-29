define(function(require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Name = require('../request_image/ImageName.react'),
      Description = require('../request_image/ImageDescription.react'),
      Tags = require('../request_image/ImageTags.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function(){
      return {
        name: "",
        description: "",
        checkCreate: true,
        imageTags: stores.InstanceTagStore.getTagsFor(this.props.instance)
      }
    },

    isSubmittable: function(){
        var hasName        = !!this.state.name;
        var hasDescription = !!this.state.description;
        return hasName && hasDescription;
      },

    onNext: function(){
      this.props.onNext({
        name: this.state.name,
        description: this.state.description
      });
    },

    onNameChange: function(newName){
      this.setState({name: newName});
    },

    onDescriptionChange: function(newDescription){
      this.setState({description: newDescription});
    },

    onTagAdded: function(addedTag){
      var imageTags = this.state.imageTags;
      imageTags.add(addedTag);
      this.setState({
        imageTags: imageTags
      })
    },

    onTagRemoved: function(removedTag){
      var imageTags = this.state.imageTags;
      imageTags.remove(removedTag);
      this.setState({
        imageTags: imageTags
      })
    },

    renderBody: function (instance) {
      return (
        <div>
          <p>
            {
              "Please provide some information to help others discover this image. The information you " +
              "provide here will be the primary means for others to discover this image."
            }
          </p>
          <Name
            create={this.state.checkCreate}
            value={this.state.name}
            onChange={this.onNameChange}
          />
          <Description onChange={this.onDescriptionChange}/>
          <Tags
            onTagAdded={this.onTagAdded}
            onTagRemoved={this.onTagRemoved}
            imageTags={this.state.imageTags}
          />
        </div>
      );
    },

    render: function () {
        var instance = this.props.instance;

        return (
          <div>
            <div className="modal-body">
              {this.renderBody(instance)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext} disabled={!this.isSubmittable()}>
                Next
              </button>
            </div>
          </div>
        );
      }

  });

});
