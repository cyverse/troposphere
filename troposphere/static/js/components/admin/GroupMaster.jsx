import React from "react";

import ComponentHandleInputWithDelay from "components/mixins/ComponentHandleInputWithDelay";
import Group from "./Group";

import stores from "stores";
import modals from "modals";


export default React.createClass({
    displayName: "GroupMaster",
    mixins: [ComponentHandleInputWithDelay],

    groups_PAGE_SIZE: 20,

    getInitialState: function() {
        return {
            query: "",
            groups: null,
        };
    },

    componentDidMount: function() {
        stores.GroupStore.addChangeListener(this.updateState);

        // Prime the data
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.GroupStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        let query = this.state.query;
        let groups;
        if (query) {
            groups = stores.GroupStore.fetchWhere({
                search: query,
                admin: true,
                page_size: this.groups_PAGE_SIZE
            });
        } else {
            groups = stores.GroupStore.fetchWhere({
                admin: true,
                page_size: this.groups_PAGE_SIZE
            });
        }
        this.setState({
            groups
        });
    },

    onSearchChange: function(e) {
        var input = e.target.value.trim();
        this.setState({
            query: input
        }, () => {
            // The callback will be called at least after 500 ms, if the
            // function is called again, its internal timer will be reset
            this.callIfNotInterruptedAfter(500 /*ms*/ , this.updateState);
        });
    },


    renderTable: function() {
        let groups = this.state.groups;

        if (!groups) {
            return <div className="loading"></div>;
        }

        let rows = groups.map(
            (group) => <Group key={group.id} group={group} />
        );

        if (rows.length == 0) {
            return (
            <div>
                <h3 className="t-title">No groups were returned from the API</h3>
            </div>
            );
        }

        return (
        <table className="table table-hover">
            <tbody>
                <tr className="admin-row">
                    <th style={{ border: "none" }}>
                        <h4
                            style={{ margin: "0" }}
                            className="t-body-2"
                        >
                            group
                        </h4>
                    </th>
                    <th style={{ border: "none" }}>
                        <h4
                            style={{ margin: "0" }}
                            className="t-body-4"
                        >
                            Users
                        </h4>
                    </th>
                    <th style={{ border: "none" }}>
                        <h4
                            style={{ margin: "0" }}
                            className="t-body-4"
                        >
                            Leaders
                        </h4>
                    </th>
                </tr>
                {rows}
            </tbody>
        </table>
        );
    },
    launchNewGroupModal: function() {
        modals.GroupModals.create();
    },
    render: function() {
        return (
        <div className="resource-master">
            <div id="create-container">
                <div className="pull-right">
                    <button className="btn btn-primary"
                            style={{marginBottom: "10px"}}
                            onClick={this.launchNewGroupModal}>
                        Create New Group
                    </button>
                </div>
            </div>
            <div id="group-container" style={{marginBottom: "20px"}}>
                <input type="text"
                    className="form-control search-input"
                    placeholder="Search for a specific group by name"
                    onChange={this.onSearchChange}
                    value={this.state.query}
                    ref="textField" />
            </div>
            <h3 className="t-title">Groups</h3>
            {this.renderTable()}
        </div>
        );
    }

});
