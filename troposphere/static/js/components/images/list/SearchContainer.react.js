define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Router = require('Router');

  var timer,
    timerDelay = 100;

  var ReactInput = React.createClass({
    componentDidMount: function () {
      this.refs.textField.getDOMNode().value = this.props.value;
    },
    componentDidUpdate: function () {
      this.refs.textField.getDOMNode().value = this.props.value;
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

    componentDidMount: function () {
      Backbone.$(this.getDOMNode()).find("input").focus();
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

});
