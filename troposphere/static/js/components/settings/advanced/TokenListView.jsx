import React from "react";
import ModalHelpers from "components/modals/ModalHelpers";
import APITokenCreate from "components/modals/api_token/APITokenCreate";
import APITokenDelete from "components/modals/api_token/APITokenDelete";
import APITokenEdit from "components/modals/api_token/APITokenEdit";
import subscribe from "utilities/subscribe";

const APITokenConfiguration = React.createClass({
    getInitialState() {
        let {ProfileStore} = this.props.subscriptions;
        var profile = ProfileStore.get();
        return {
            profile
        };
    },

    launchDeleteModal(token) {
        ModalHelpers.renderModal(APITokenDelete, {
            token
        });
    },

    launchCreateModal(user) {
        ModalHelpers.renderModal(APITokenCreate, {
            user
        });
    },

    launchEditModal(token) {
        ModalHelpers.renderModal(APITokenEdit, {
            token
        });
    },

    style() {
        return {
            td: {
                wordWrap: "break-word",
                whiteSpace: "normal"
            },
            labelName: {
                width: "100%"
            }
        };
    },

    renderTokenRow(apiToken) {
        let {td} = this.style();

        let key = apiToken.get("name") + apiToken.cid;
        return (
            <tr key={key}>
                <td style={td}>{apiToken.get("name")}</td>
                <td>
                    <a onClick={this.launchEditModal.bind(this, apiToken)}>
                        <i className="glyphicon glyphicon-pencil" />
                    </a>{" "}
                    <a onClick={this.launchDeleteModal.bind(this, apiToken)}>
                        <i
                            style={{color: "crimson"}}
                            className="glyphicon glyphicon-trash"
                        />
                    </a>
                </td>
            </tr>
        );
    },

    render() {
        let {APITokenStore} = this.props.subscriptions,
            profile = this.state.profile,
            apiTokens = APITokenStore.getAll();
        return (
            <div>
                <h3>Personal Access Tokens</h3>
                <div style={{maxWidth: "600px"}}>
                    <p>
                        Personal Access Tokens are API Tokens that can be used
                        instead of passwords for authentication. Other
                        aplications can use Personal Access Tokens to access
                        Atmosphere services under your account.
                    </p>
                </div>
                <div style={{maxWidth: "80%"}}>
                    <table
                        className="clearfix table"
                        style={{tableLayout: "fixed"}}>
                        <thead>
                            <tr>
                                <th style={{width: "100%"}}>Name</th>
                                <th style={{width: "60px"}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(apiTokens || []).map(this.renderTokenRow)}
                            <tr>
                                <td>
                                    <a
                                        onClick={this.launchCreateModal.bind(
                                            this,
                                            profile.get("user")
                                        )}>
                                        <i className="glyphicon glyphicon-plus" />
                                    </a>
                                </td>
                                <td />
                                <td />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

export default subscribe(APITokenConfiguration, [
    "APITokenStore",
    "ProfileStore"
]);
