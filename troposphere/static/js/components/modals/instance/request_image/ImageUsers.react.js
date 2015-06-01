define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      ChosenDropdown = require('components/common/tags/ChosenUsersDropdown.react');

  return React.createClass({

    propTypes: {
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired,
      imageTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      //var imageUsers = this.props.users,
      //    users = stores.UserStore.getAll();

      var imageTags = this.props.imageTags,
          tags = stores.TagStore.getAll();

      if(!tags) return <div className="loading"/>;

      return (
        <div className="form-group">
          <label htmlFor="tags" className="control-label">Users</label>
          <div className="tagger_container">
            <div className="help-block">
              Please include users that should be able to launch this image.
            </div>
            <ChosenDropdown
              tags={tags}
              activeTags={imageTags}
              onTagAdded={this.props.onTagAdded}
              onTagRemoved={this.props.onTagRemoved}
              onEnterKeyPressed={function(){}}
              width={"100%"}
            />
          </div>
        </div>
      );
    }

  });

});
