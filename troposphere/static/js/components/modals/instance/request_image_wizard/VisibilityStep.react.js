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
        visibility: "public",
        imageUsers: new Backbone.Collection()
      };
    },

    getInitialState: function(){
      return {
        visibility: this.props.visibility,
        users: this.props.users,
        imageUsers: this.props.imageUsers
      }
    },

    isSubmittable: function(){
      var hasVisibility = !!this.state.visibility;
      return hasVisibility;
    },

    onPrevious: function(){
      this.props.onPrevious({
        visibility: this.state.visibility,
        imageUsers: this.state.imageUsers
      });
    },

    onNext: function(){
      this.props.onNext({
        visibility: this.state.visibility,
        imageUsers: this.state.imageUsers
      });
    },

    onProviderChange: function(newProviderId){
      this.setState({
        providerId: newProviderId
      });
    },

    onVisibilityChange: function(newVisibility){
      // when we change visibility we should reset the user list to empty
      this.setState({
        visibility: newVisibility,
        imageUsers: new Backbone.Collection()
      });
    },

    onAddUser: function(user){
      var imageUsers = this.state.imageUsers;
      imageUsers.add(user);
      this.setState({
        imageUsers: imageUsers
      });
    },

    onRemoveUser: function(user){
      var imageUsers = this.state.imageUsers;
      imageUsers.remove(user);
      this.setState({
        imageUsers: imageUsers
      })
    },

    renderUserList: function(){
      if(this.state.visibility === "select"){
        return (
          <Users
            imageUsers={this.state.imageUsers}
            onUserAdded={this.onAddUser}
            onUserRemoved={this.onRemoveUser}
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
