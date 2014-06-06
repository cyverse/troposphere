/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './AdvancedOptions.react'
  ],
  function (React, Backbone, AdvancedOptions) {

    var SearchContainer = React.createClass({

      getDefaultProps: function () {
        return {query: ""};
      },

      getInitialState: function () {
        return {
          showAdvancedOptions: false,
          query: this.props.query
        }
      },

      statics: {
        handleSearch: function (query) {
          var queryUrl = "images/search/" + encodeURIComponent(query);
          Backbone.history.navigate(queryUrl, {trigger: true});
        }
      },

      toggleAdvancedOptions: function (e) {
        e.preventDefault();
        this.setState({showAdvancedOptions: !this.state.showAdvancedOptions});
      },

      handleChange: function (e) {
        this.setState({query: e.target.value});
      },

      handleKeyUp: function (e) {
        if (e.keyCode == 13 && this.state.query.length) {
          SearchContainer.handleSearch(this.state.query);
        }
      },

      render: function () {
        var linkText = (this.state.showAdvancedOptions ? "Hide" : "Show") + " Advanced Search Options";


        // todo: implement advanced search and put this back in the code
        //  <a onClick={this.toggleAdvancedOptions} href='#'>{linkText}</a>
        //  <AdvancedOptions visible={this.state.showAdvancedOptions}/>

        return (
          <div id='search-container'>
            <input
              type='text'
              className='form-control search-input'
              placeholder='Search by Image Name, Tag, OS, and more'
              onChange={this.handleChange}
              value={this.state.query}
              onKeyUp={this.handleKeyUp}
            />
            <hr/>
          </div>
        );
      }

    });

    return SearchContainer;

  });
