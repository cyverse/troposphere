import React from 'react/addons';
import Router from 'react-router';
import stores from 'stores';
import ComponentHandleInputWithDelay from 'components/mixins/ComponentHandleInputWithDelay';
import AtmosphereUser from './AtmosphereUser.react';

export default React.createClass({
    displayName: 'AtmosphereUserMaster',
    mixins: [Router.State, ComponentHandleInputWithDelay],

    getInitialState: function() {
        return {
            query: '',
            users: null,
        };
    },

    USERS_PAGE_SIZE: 20,

    componentDidMount: function() {
        stores.UserStore.addChangeListener(this.updateState);

        // Prime the data
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.UserStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        let query = this.state.query;
        let users;
        if (query) {
            users = stores.UserStore.fetchWhere({
                username: query,
                page_size: this.USERS_PAGE_SIZE
            });
        } else {
            users = stores.UserStore.fetchWhere({
                page_size: this.USERS_PAGE_SIZE
            });
        }
        this.setState({
            users
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
        let users = this.state.users;

        if (!users) {
            return <div className="loading"></div>;
        }

        let rows = users.map(
            (user) => <AtmosphereUser key={ user.id } user={ user } />
        );

        if (rows.length == 0) {
            return (
            <div>
                <h3>No Users were returned from the API</h3>
            </div>
            );
        }

        return (
        <table className="admin-table table table-striped table-hover" style={ { marginTop: '20px' } }>
            <tbody>
                <tr className="admin-row">
                    <th>
                        <h4>User</h4>
                    </th>
                    <th>
                        <h4>E-Mail</h4>
                    </th>
                    <th>
                        <h4>Staff</h4>
                    </th>
                    <th>
                        <h4>Superuser</h4>
                    </th>
                    <th>
                        <h4>Enabled/Disabled</h4>
                    </th>
                </tr>
                { rows }
            </tbody>
        </table>
        );
    },
    render: function() {
        return (
        <div className="resource-master">
            <div id='user-container'>
                <input type='text'
                       className='form-control search-input'
                       placeholder='Search for a specific user by username'
                       onChange={ this.onSearchChange }
                       value={ this.state.query }
                       ref="textField" />
            </div>
            <h3>Atmosphere Users</h3>
            { this.renderTable() }
        </div>
        );
    }

});
