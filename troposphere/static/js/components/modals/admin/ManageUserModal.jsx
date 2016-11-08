import React from "react";
import InteractiveDateField from "components/common/InteractiveDateField";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";


export default React.createClass({

    displayName: "ManageUserModal",

    mixins: [BootstrapModalMixin],

    getInitialState: function() {
        return {
            endDate: ""
        };
    },

    handleEndDateChange: function(value) {
        var endDate = value;
        this.setState({
            endDate: endDate
        });
    },

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        console.log("A user Action will get called here");
    },

    render: function() {
        var ident_member = this.props.ident_member;

        var content = (
        <div>
            <h4 className="t-body-2">Manage User End Date</h4>
            <ul>
                <li>
                    <b>User Name:</b>
                    {ident_member.get("user").username}
                </li>
                <li>
                    <b>Provider:</b>
                    {ident_member.get("provider").name}
                </li>
            </ul>
            <p>
                Input a date to suspend this users account
            </p>
            <InteractiveDateField value={this.state.endDate} onChange={this.handleEndDateChange} />
        </div>
        );

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">{this.props.header}</h1>
                    </div>
                    <div className="modal-body">
                        {content}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default" onClick={this.cancel}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={this.confirm}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
