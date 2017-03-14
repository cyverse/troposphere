import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import muiThemeable from "material-ui/styles/muiThemeable";
import Backbone from "backbone";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

const DeleteLinkModal = React.createClass({
    displayName: "ExternalLinkDeleteModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onConfirm: React.PropTypes.func.isRequired
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
        this.props.onConfirm();
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        var link = this.props.external_link;
        return (
        <div>
            <p>
                {"Are you sure you want to delete the link "}
                <strong>{link.get("name")}</strong>
                {"?"}
            </p>
        </div>
        );
    },

    render: function() {
        const { 
            muiTheme: {
                palette: {
                    danger
                }
            }
        } = this.props;

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Delete Link</h1>
                    </div>
                    <div className="modal-body" style={{ minHeight: "200px" }}>
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
                            label="Yes, delete this link"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
export default muiThemeable()(DeleteLinkModal);
