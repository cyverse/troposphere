import React from "react";
import Backbone from "backbone";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import actions from "actions";
import {RaisedButton} from "material-ui";

export default React.createClass({
    mixins: [BootstrapModalMixin],
    propTypes: {
        token: React.PropTypes.number.isRequired
    },

    getInitialState() {
        const {token} = this.props;
        return {
            errorMsg: "",
            name: token.get("name")
        };
    },

    updateName(e) {
        this.setState({
            name: e.target.value
        });
    },

    onSubmit() {
        const {name} = this.state;
        this.hide();
    },

    render() {
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton}
                            <h1 className="t-title">
                                Edit Personal Access Token Name
                            </h1>
                        </div>
                        <div
                            style={{minHeight: "300px"}}
                            className="modal-body">
                            <p>
                                You can change the name of your Access Token.
                                Note that the Token Hash can not be changed. If
                                you want to change the hash and keep the name,
                                delete this Token and create a new Token with
                                the same name.
                            </p>
                            <div className="form-group">
                                <label className="control-label">Name</label>
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        onChange={this.updateName}
                                        value={this.state.name}
                                    />
                                    * Name Required
                                </div>
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
                                disabled={!this.state.name}
                                onClick={this.onSubmit}
                                label="Save Change"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
