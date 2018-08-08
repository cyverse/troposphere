import React from "react";
import Backbone from "backbone";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import actions from "actions";
import {RaisedButton} from "material-ui";
import WarningIcon from "material-ui/svg-icons/alert/warning";

export default React.createClass({
    propTypes: {
        token: React.PropTypes.instanceOf(Backbone.Model),
        user: React.PropTypes.number.isRequired
    },

    mixins: [BootstrapModalMixin],

    onSubmit() {
        this.hide();
    },

    render() {
        const {token} = this.props;
        const name = token.get("name");
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <h1 className="t-title">
                                Delete Personal Access Token
                            </h1>
                        </div>
                        <div
                            style={{minHeight: "300px"}}
                            className="modal-body">
                            <div style={{display: "flex"}}>
                                <WarningIcon style={{marginRight: "16px"}} />{" "}
                                <p>
                                    {`Are you sure you want to delete Access Token "${name}"? Any applications using this Token will not be able to connect to your account`}
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <RaisedButton
                                style={{marginRight: "16px"}}
                                onClick={this.hide}
                                label="Cancel"
                            />
                            <RaisedButton
                                primary
                                onClick={this.onSubmit}
                                label="Yes, Delete Token"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
