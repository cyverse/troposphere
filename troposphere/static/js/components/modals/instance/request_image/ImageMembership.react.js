define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores');
      ChosenDropdown = require('components/common/tags/ChosenDropdown.react');

  return React.createClass({

    propTypes: {
      onMembershipAdded: React.PropTypes.func.isRequired,
      onMembershipRemoved: React.PropTypes.func.isRequired,
      versionMemberships: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      var activeVersionMemberships = this.props.versionMemberships,
          memberships = activeVersionMemberships; //Should be stores.MembershipStore

      if(!memberships) return <div className="loading"/>;

      return (
        <div className="form-group">
          <label htmlFor="memberships" className="control-label">Version Memberships</label>
          <div className="membership_container">
            <div className="help-block">
              These users will be able to view and launch this version of your application.
            </div>
            <ChosenDropdown
              tags={memberships}
              activeTags={activeVersionMemberships}
              onTagAdded={this.props.onMembershipAdded}
              onTagRemoved={this.props.onMembershipRemoved}
              onEnterKeyPressed={function(){}}
              width={"100%"}
            />
          </div>
        </div>
      );
    }

  });

});
