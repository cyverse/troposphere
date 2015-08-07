define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    Name = require('../components/Name.react'),
    CreateUpdateFlag = require('../components/CreateUpdateFlag.react'),
    Description = require('../components/Description.react'),
    Tags = require('../components/Tags.react'),
    stores = require('stores');

  return React.createClass({
    displayName: "ImageInfoStep",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      imageOwner: React.PropTypes.bool.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      newImage: React.PropTypes.bool.isRequired
    },

    getDefaultProps: function () {
      return {
        name: "",
        description: "",
        imageOwner: false,
        imageTags: null,
        newImage: true,
      };
    },

    getInitialState: function () {
      return {
        name: this.props.name,
        description: this.props.description,
        newImage: this.props.newImage,
        imageTags: this.props.imageTags || stores.InstanceTagStore.getTagsFor(this.props.instance),
      }
    },

    isSubmittable: function () {
      var hasName = !!this.state.name;
      var hasDescription = !!this.state.description;
      return hasName && hasDescription;
    },

    onNext: function () {
      this.props.onNext({
        name: this.state.name,
        description: this.state.description,
        imageTags: this.state.imageTags,
        newImage: this.state.newImage
      });
    },

    onNameChange: function (newName) {
      this.setState({name: newName});
    },
    onCreateUpdateChange: function(checked){
      this.setState({newImage: checked});
    },

    onDescriptionChange: function (newDescription) {
      this.setState({description: newDescription});
    },

    onTagAdded: function (addedTag) {
      var imageTags = this.state.imageTags;
      imageTags.add(addedTag);
      this.setState({
        imageTags: imageTags
      })
    },

    onTagRemoved: function (removedTag) {
      var imageTags = this.state.imageTags;
      imageTags.remove(removedTag);
      this.setState({
        imageTags: imageTags
      })
    },
    renderCreateUpdateFlag: function () {
      if (this.props.imageOwner) {
        return (
          <CreateUpdateFlag
            value={this.state.newImage}
            onChange={this.onCreateUpdateChange}
            />
        );
      } else {

      }
    },
    renderBody: function (instance) {
      return (
        <div>
          <div className="alert alert-danger">
            <strong>Note:</strong> All volumes must be detached from an instance before it can be imaged.
          </div>
          <p className="alert alert-info">
            {"Please read the "}
            <a href="https://pods.iplantcollaborative.org/wiki/x/oIZy" target="_blank">
              wiki page about requesting an image of your instance
            </a>
            {" before completing the form below."}
          </p>

          <p>
            {
              "Please provide some information to help others discover this image. The information you " +
              "provide here will be the primary means for others to discover this image."
            }
          </p>

          <p>
            {
              "Fields marked with * are required."
            }
          </p>
          {this.renderCreateUpdateFlag()}
          <Name
            create={this.state.newImage}
            value={this.state.name}
            onChange={this.onNameChange}
            />
          <Description
            value={this.state.description}
            onChange={this.onDescriptionChange}
            />
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
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext}
                    disabled={!this.isSubmittable()}>
              Next
            </button>
          </div>
        </div>
      );
    }

  });

});
