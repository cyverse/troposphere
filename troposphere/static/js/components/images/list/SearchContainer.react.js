import React from 'react';
import ReactDOM from 'react-dom';
import Backbone from 'backbone';
import Router from 'Router';

let timer,
    timerDelay = 100;

let ReactInput = React.createClass({
    componentDidMount: function () {
      this.refs.textField.value = this.props.value;
    },
    componentDidUpdate: function () {
      this.refs.textField.value = this.props.value;
    },
    render: function () {
      return (
        <input type='text'
               className='form-control search-input'
               placeholder='Search across image name, tag or description'
               onChange={this.props.onChange}
               value={this.props.value}
               onKeyUp={this.props.onKeyUp}
               ref="textField"
          />
      );
    }
});

export default React.createClass({
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

    componentDidMount: function () {
      Backbone.$(ReactDOM.findDOMNode(this)).find("input").focus();
    },

    handleSearch: function (query) {
      var queryUrl;

      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        query = this.state.query;
        if (query) {
          queryUrl = "images/search/" + encodeURIComponent(query);
          Backbone.history.navigate(queryUrl, {trigger: true});
        } else {
          Router.getInstance().transitionTo("images", {projectId: project.id});
        }
      }.bind(this), timerDelay);
    },

    handleChange: function (e) {
      this.setState({query: e.target.value});
    },

    handleKeyUp: function (e) {
      //if (e.keyCode == 13 && this.state.query.length) {
      //if (this.state.query.length) {
      this.handleSearch(this.state.query);
      //}
    },

    render: function () {
      return (
        <div id='search-container'>

          <ReactInput value={this.state.query}
                      onChange={this.handleChange}
                      onKeyUp={this.handleKeyUp}
            />
          <hr/>
        </div>
      );
    }
});
