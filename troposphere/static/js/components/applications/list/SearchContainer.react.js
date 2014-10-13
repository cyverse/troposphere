/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({
      displayName: "SearchContainer",

      getDefaultProps: function () {
        return {
          query: ""
        };
      },

      getInitialState: function () {
        return {
          query: this.props.query
        }
      },

      handleSearch: function (query) {
        var queryUrl = "images/search/" + encodeURIComponent(query);
        Backbone.history.navigate(queryUrl, {trigger: true});
      },

      handleChange: function (e) {
        this.setState({query: e.target.value});
      },

      handleKeyUp: function (e) {
        if (e.keyCode == 13 && this.state.query.length) {
          this.handleSearch(this.state.query);
        }
      },

      render: function () {
        return (
          <div id='search-container'>
            <input
              type='text'
              className='form-control search-input'
              placeholder='Search across image name, tag or description'
              onChange={this.handleChange}
              value={this.state.query}
              onKeyUp={this.handleKeyUp}
            />
            <hr/>
          </div>
        );
      }

    });

  });
