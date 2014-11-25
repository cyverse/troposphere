/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ImageDetails.react'
  ],
  function (React, Backbone, ImageDetails) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onPrevious: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired
      },

      //
      // Callbacks
      //

      onBack: function(){
        this.props.onPrevious(this.props.image);
      },

      onConfigure: function(){
        this.props.onNext(this.props.image);
      },

      //
      // Render
      // ------
      //

      renderTag: function(tagName){
        return (
          <li>{tagName}</li>
        )
      },

      renderTags: function(image){
        return (
          <ul className="tags">{image.get('tags').map(this.renderTag)}</ul>
        )
      },

      renderBody: function(image, providers, identities, tags){
        if(image && providers && identities && tags) {
          return (
            <ImageDetails
              image={image}
              providers={providers}
              identities={identities}
              tags={tags}
            />
          );
        }

        return (
          <div className="loading"/>
        )
      },

      render: function () {
        var image = this.props.image,
            providers = this.props.providers,
            identities = this.props.identities,
            tags = this.props.tags;

        return (
          <div>
            <div className="modal-body">
              {this.renderBody(image, providers, identities, tags)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default cancel-button" onClick={this.onBack}>
                Back
              </button>
              <button type="button" className="btn btn-primary cancel-button" onClick={this.onConfigure}>
                Configure
              </button>
            </div>
          </div>
        );
      }

    });

  });
