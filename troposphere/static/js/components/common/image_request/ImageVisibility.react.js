define(function (require) {

    var React = require('react'),
        Backbone = require('backbone'),
        MembershipList = require('./ImageMembership.react');

    return React.createClass({

        propTypes: {
            onChange: React.PropTypes.func.isRequired,
            all_users: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
            membership_list: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
            value: React.PropTypes.string.isRequired
        },

        handleChange: function (e) {
            this.props.onChange(e.target.value)
        },
        renderMembershipList: function () {
            if (this.props.value != "public") {
                if (this.props.all_users == null) {
                    //Wait to render if users aren't available. they will load soon.
                    return (<div className="loading"/>);
                } else {
                    return (<MembershipList
                        membership_list={this.props.membership_list}
                    />);

                }
            } else {
                return (<div className="membership-list-hidden"/>);
            }
        },
        render: function () {
            return (
                <div className="form-group">
                    <label htmlFor="vis" className="control-label">Image Visibility</label>
                    <div className="help-block">
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
