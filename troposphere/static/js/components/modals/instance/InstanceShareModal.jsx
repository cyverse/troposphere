import React from "react";
import Backbone from "backbone";
import subscribe from 'utilities/subscribe';
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import InstanceAccessRequestView from "components/common/InstanceAccessRequestView";

const InstanceShareModal = React.createClass({
    displayName: "InstanceShareModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        user: React.PropTypes.instanceOf(Backbone.Model)
    },
    getInitialState: function() {
        return {
            user: this.props.user || null,
        }
    },
    onSelectUser: function(user) {
        this.setState({
            user,
        });
    },
    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm({
            user: this.state.user,
        });
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        let instance = this.props.instance;
        return (<InstanceAccessRequestView instance={instance} onSelectUser={this.onSelectUser} />);
    },

    isSubmittable: function() {
        var hasUser = !!this.state.user;
        return hasUser;
    },
    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Share Instance</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            style={{ marginRight: "10px" }}
                            onTouchTap={this.cancel}
                            label="Cancel"
                        />
                       <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            disabled={!this.isSubmittable()}
                            label="Create Request"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
export default subscribe( InstanceShareModal, ["InstanceAccessStore", "UserStore"]);
