import React from 'react';
import stores from 'stores';
import Router from 'react-router';

export default React.createClass({
    displayName: "ImageTagsPage",

    getState: function () {
      return {
        images: stores.ImageStore.getAll(),
        tags: stores.TagStore.getAll()
      };
    },

    getInitialState: function () {
      var state = this.getState();
      state.searchTerm = "";
      return state;
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function () {
      stores.ImageStore.addChangeListener(this.updateState);
      stores.TagStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ImageStore.removeChangeListener(this.updateState);
      stores.TagStore.removeChangeListener(this.updateState);
    },

    handleFilterChange: function (e) {
      var searchTerm = e.target.value;
      this.setState({searchTerm: searchTerm});
    },

    renderTagRow: function (tag) {
      var name = tag.get('name'),
        description = tag.get('description');

      return (
        <tr key={tag.id || tag.cid}>
          <td style={{"verticalAlign":"top","width":"117px"}}>
            <h4 style={{"margin":"0", "color":"#5A5A5A", "fontSize":"18px"}}>
              <Router.Link to="search" query={{q: name}}>{name}</Router.Link>
            </h4>
          </td>
          <td>
            <p style={{"fontSize":"14px"}}>
              {description}
            </p>
          </td>
        </tr>
      )
    },

    getFilteredTags: function (tags, searchTerm) {
      var filteredTags = tags;
      searchTerm = searchTerm.trim().toLowerCase();

      if (searchTerm) {
        filteredTags = tags.filter(function (tag) {
          var name = tag.get("name").toLowerCase(),
            description = tag.get("description").toLowerCase();

          return name.indexOf(searchTerm) >= 0 || description.indexOf(searchTerm) >= 0;
        });

        filteredTags = new tags.constructor(filteredTags);
      }

      return filteredTags;
    },

    renderTagsAsTable: function (tags) {
      if (tags) {
        return (
          <table className="table">
            <tbody>
            {tags.map(this.renderTagRow)}
            </tbody>
          </table>
        )
      }

      return (
        <div className="loading"></div>
      )
    },

    render: function () {
      var tags = this.state.tags,
        searchTerm = this.state.searchTerm,
        text = "";

      if (tags) {
        tags = this.getFilteredTags(tags, searchTerm);
      }

      if (tags && this.state.searchTerm) {
        if (tags.length > 0) {
          text = 'Showing tags matching "' + searchTerm + '"';
        } else {
          text = 'No tags matching "' + searchTerm + '"';
        }
      } else {
        text = "Showing all tags"
      }

      return (
        <div className="container">
          <div id="search-container">
            <input type="text"
                   className="form-control search-input"
                   placeholder="Filter by tag name or description"
                   value={this.state.searchTerm}
                   onChange={this.handleFilterChange}
              />
            <hr/>
            <h3 style={{textAlign: "left", fontSize: "24px"}}>
              {text}
            </h3>
          </div>
          <div className="image-tag-list">
            {this.renderTagsAsTable(tags)}
          </div>
        </div>
      );

    }
});
