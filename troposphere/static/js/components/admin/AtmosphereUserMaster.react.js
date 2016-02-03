define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    stores = require('stores'),
    AtmosphereUser = require('./AtmosphereUser.react');
  var timer,
    timerDelay = 100;


  return React.createClass({
    displayName: "AtmosphereUserMaster",
    mixins: [Router.State],
    getInitialState: function() {
        return {
            query: "",
            allModels: null,
        };
    },

    componentDidMount: function () {
      stores.UserStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.UserStore.removeChangeListener(this.updateState);
    },

    //Borrowed shamelessly from ImageListView
    handleSearch: function (input) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(function () {
        this.setState({query: this.state.query});
      }.bind(this), timerDelay);
    },

    onSearchChange: function (e) {
      var input = e.target.value;
      this.setState({query: input});
      this.handleSearch(input);
    },


    renderTable: function () {
      var users;
     var query_params = {};
      if(this.state.query !== null && this.state.query !== "") {
          query_params.username = this.state.query
      }
      if(query_params) {
          users = stores.UserStore.fetchWhere(query_params);
      } else {
          users = stores.UserStore.getAll();
      }

      if (!users) return <div className="loading"></div>;

      var atmosphereUserRows = users.map(function (user) {
        return (
          <AtmosphereUser key={user.id} user={user}/>
        )
      });

      if (!atmosphereUserRows[0]) {
        return  (
                <div>
                 <h3>No Users were returned from the API</h3>
                </div>
                );
      }
      return (
          <table className="admin-table table table-striped table-hover" style={{marginTop: "20px"}}>
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
              {atmosphereUserRows}
            </tbody>
          </table>
        );
    },
    render: function () {
      return (
        <div className="resource-master">
          <div id='user-container'>
            <input
            type='text'
            className='form-control search-input'
            placeholder='Search for a specific user by username'
            onChange={this.onSearchChange}
            value={this.state.query}
            ref="textField"
            />
          </div>
          <h3>Atmosphere Users</h3>
          {this.renderTable()}
        </div>
      );
    }

  });

});
