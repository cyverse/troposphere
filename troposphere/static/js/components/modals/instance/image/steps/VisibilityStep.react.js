define(function(require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Visibility = require('../components/Visibility.react'),
      stores = require('stores'),
      Users = require('../components/Users.react');

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
        imageUsers: this.props.imageUsers || new Backbone.Collection()
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

    onSubmit: function() {
      this.props.onSubmit({
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
            <button type="button" className="btn btn-info next-button" onClick={this.onNext} disabled={!this.isSubmittable()}>
              Advanced Options
            </button>
            <button type="button" className="btn btn-primary submit-button" onClick={this.onSubmit} disabled={!this.isSubmittable()}>
              Submit
            </button>
          </div>
        </div>
      );
    }

  });

});
