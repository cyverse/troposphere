define(function(require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Visibility = require('../request_image/ImageVisibility.react'),
      stores = require('stores'),
      Users = require('../request_image/ImageUsers.react');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getDefaultProps: function() {
      return {
        visibility: "public"
      };
    },

    getInitialState: function(){
      return {
        visibility: this.props.visibility
      }
    },

    isSubmittable: function(){
      var hasVisibility = !!this.state.visibility;
      return hasVisibility;
    },

    onPrevious: function(){
      this.props.onPrevious({
        visibility: this.state.visibility
      });
    },

    onNext: function(){
      this.props.onNext({
        visibility: this.state.visibility
      });
    },

    onProviderChange: function(newProviderId){
      this.setState({
        providerId: newProviderId
      });
    },

    onVisibilityChange: function(newVisibility){
      this.setState({
        visibility: newVisibility
      });
    },

    renderUserList: function(){
      if(this.state.visibility === "select"){
        return (
          <Users
            onTagAdded={function(){}}
            onTagRemoved={function(){}}
            imageTags={stores.InstanceTagStore.getTagsFor(this.props.instance)}
          />
        )
      }
    },

    renderBody: function () {
      return (
        <div>
          <p>Please select the level of visibility this image should have.</p>
          <p><strong>Public:</strong> All users will be able to see this image</p>
          <p><strong>Private:</strong> Only you will be able to see this image</p>
          <p><strong>Specific Users:</strong> Only you and the users you specify will be able to see this image</p>
          <Visibility
            instance={this.props.instance}
            value={this.state.visibility}
            onChange={this.onVisibilityChange}
          />
          {this.renderUserList()}
        </div>
      );
    },

    render: function () {
      return (
        <div>
          <div className="modal-body">
            {this.renderBody()}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext} disabled={!this.isSubmittable()}>
              Next
            </button>
          </div>
        </div>
      );
    }

  });

});
