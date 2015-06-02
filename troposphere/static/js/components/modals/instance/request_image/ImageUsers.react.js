define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      ChosenDropdown = require('components/common/tags/ChosenUsersDropdown.react');

  return React.createClass({

    propTypes: {
      onUserAdded: React.PropTypes.func.isRequired,
      onUserRemoved: React.PropTypes.func.isRequired,
      imageUsers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      //var imageUsers = this.props.users,
      //    users = stores.UserStore.getAll();

      var imageUsers = this.props.imageUsers,
          users = stores.UserStore.getAll();

      if(!users) return <div className="loading"/>;

      return (
        <div className="form-group">
          <label htmlFor="tags" className="control-label">Users</label>
          <div className="tagger_container">
            <div className="help-block">
              Please include users that should be able to launch this image.
            </div>
            <ChosenDropdown
              tags={users}
              activeTags={imageUsers}
              onTagAdded={this.props.onUserAdded}
              onTagRemoved={this.props.onUserRemoved}
              onEnterKeyPressed={function(){}}
              width={"100%"}
            />
          </div>
        </div>
      );
    }

  });

});
