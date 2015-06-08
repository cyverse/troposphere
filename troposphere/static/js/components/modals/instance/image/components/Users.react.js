define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      ChosenDropdown = require('components/common/tags/UserMultiSelect.react');

  return React.createClass({

    propTypes: {
      onUserAdded: React.PropTypes.func.isRequired,
      onUserRemoved: React.PropTypes.func.isRequired,
      imageUsers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    getInitialState: function(){
      return {
        query: ""
      }
    },

    onUserAdded: function(user){
      this.setState({query: ""});
      this.props.onUserAdded(user);
    },

    onQueryChange: function(query){
      this.setState({query: query});
    },

    render: function () {
      var imageUsers = this.props.imageUsers,
          query = this.state.query,
          users;

      if(this.state.query){
        users = stores.UserStore.fetchWhere({
          search: query
        });
      }else{
        users = stores.UserStore.getAll();
      }

      //if(!users) return <div className="loading"/>;

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
              onModelAdded={this.onUserAdded}
              onModelRemoved={this.props.onUserRemoved}
              onEnterKeyPressed={function(){}}
              width={"100%"}
              onQueryChange={this.onQueryChange}
              placeholderText="Search by username..."
            />
          </div>
        </div>
      );
    }

  });

});
