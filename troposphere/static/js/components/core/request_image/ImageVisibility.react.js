define(function (require) {

  var React = require('react'),
      MembershipList = require('./ImageMembership.react');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      membership_list: React.PropTypes.array.isRequired,
      value: React.PropTypes.string.isRequired
    },

    handleChange: function(e){
      this.props.onChange(e.target.value)
    },
    addMemberToList: function(member_name) {
       var add_list = this.props.membership_list;
       add_list.push(member_name);
       this.setState({membership_list: add_list});
    },
    removeMemberFromList: function(member_name) {
      console.log("Remove",member_name);
    },
    renderMembershipList: function () {
        if(this.props.value != "public") {
        return (<MembershipList onMembershipAdded={this.addMemberToList}
      onMembershipRemoved={this.removeMemberFromList}
      existingMemberships={this.props.membership_list}
        />);
      } else {
            return(<div className="hidden-membership-list"/>);
       }
    },
    render: function () {
      return (
        <div className="form-group">
          <label htmlFor="vis" className="control-label">Image Visibility</label>
          <div className="help-block" id="vis_help">
            A VM image can be made visible to you, a select group of users or to
            everyone. If you want visibility restricted to a select group of users, provide us a list of iPlant
            usernames. Public visibility means that any user will be able to launch the instance.
          </div>
          <select value={this.props.value} name="visibility" className="form-control" onChange={this.handleChange}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="select">Specific Users</option>
          </select>
        {this.renderMembershipList()}
        </div>
      );
    }

  });

});
