define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    ManyToManyList = require('components/common/ManyToManyList.react');

  return React.createClass({
    displayName: "ImageMembership",

    propTypes: {
      membership_list: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },
    addMemberToList: function (user) {
      var add_list = this.props.membership_list;
      add_list.add(user);
      this.setState({membership_list: add_list});
    },
    removeMemberFromList: function (user) {
      console.log("Remove", user);
      var rem_list = this.props.membership_list;
      rem_list.remove(user);
      this.setState({membership_list: rem_list});
    },
    renderForm: function () {
      return (<div className="form-group">
        <div className="search-field">
          <input type="text" placeholder="Username..." className="default" autoComplete="off"/>
        </div>
      </div>);

    },

    render: function () {

      return (
        <ManyToManyList renderForm={this.renderForm}
                        onAddObject={this.addMemberToList}
                        onRemoveObject={this.removeMemberFromList}
                        existing_items={this.props.membership_list}
                        title="Image Membership"/>
      );
    }

  });

});
