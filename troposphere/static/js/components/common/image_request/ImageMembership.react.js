define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  return React.createClass({

    propTypes: {
      onMembershipAdded: React.PropTypes.func.isRequired,
      onMembershipRemoved: React.PropTypes.func.isRequired,
      existingMemberships: React.PropTypes.array.isRequired
    },
    onKeyUp: function(e) {
        if(e.keyCode == 13 || e.keyCode == 188 || e.keyCode == 32) {
            if(e.keyCode == 13) {
                target_value = e.target.value;
            } else {
                target_value = e.target.value.slice(0,-1);
            }
            this.addMembershipRow(target_value);
            e.target.value = "";
        }
    },
    addMembershipRow: function(username) {
        username = username.toLocaleLowerCase();
        this.props.onMembershipAdded(username);
    },
    removeMembershipRow: function(e) {
        var username = e.target.parentNode.innerText;
        username = username.toLocaleLowerCase();
        this.props.onMembershipRemoved(username);
    },
    renderMembershipRow: function(membership) {
      return (
          <li className="search-choice">
            <span>{membership}</span>
            <a className="search-choice-close" onClick={this.removeMembershipRow}></a>
          </li>
      )
    },
    render: function () {

      return (
        <div className="form-group">
          <label htmlFor="memberships" className="control-label">Select Membership</label>
          <div className="membership_container">
            <div className="help-block">
              These users will be able to view and launch this version of your application.
              To add a new user, Enter the EXACT username press [Space], [Enter] or [,]
            </div>
            <div className="chosen-container chosen-container-multi chosen-with-drop chosen-container-active">
                <ul className="chosen-choices">
                {this.props.existingMemberships.map(this.renderMembershipRow)}
                <li className="search-field">
                  <input type="text" placeholder="Username..." className="default" autoComplete="off" onKeyUp={this.onKeyUp}/>
                </li>
              </ul>

            </div>

          </div>
        </div>
      );
    }

  });

});
