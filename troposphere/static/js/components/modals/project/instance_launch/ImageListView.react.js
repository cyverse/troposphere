/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    './ImageList.react'
  ],
  function (React, Backbone, stores, ImageList) {

    var ENTER_KEY = 13;

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        onPrevious: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired
      },

      getInitialState: function(){
        return this.getState();
      },

      getState: function() {
        var query = this.state ? this.state.query : null;
        var querySubmitted = this.state ? this.state.querySubmitted : false;
        return {
          query: query,
          querySubmitted: querySubmitted,
          images: stores.ApplicationStore.getAll()
        }
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

      componentDidMount: function () {
        stores.ApplicationStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      handleChange: function (e) {
        var query = e.target.value;
        this.setState({query: query, querySubmitted: false});
      },

      handleKeyUp: function (e) {
        var query = this.state.query;
        if (e.keyCode == ENTER_KEY && query.length) {
          this.setState({query: query, querySubmitted: true});
        }
      },

      showImageDetails: function(image){
        this.props.onNext(image);
      },

      //
      // Callbacks
      //

      onBack: function(){
        this.props.onPrevious();
      },

      //
      // Render
      // ------
      //

      renderFilterDescription: function(query){
        var message;

        if(query){
          message = 'Showing results for "' + query + '"';
        }else{
          message = "Showing all images"
        }

        return (
          <span className="filter-description">{message}</span>
        )
      },

      renderBody: function(){
        var images = this.state.images,
            query = this.state.query,
            querySubmitted = this.state.querySubmitted;

        // if a search has been requested, use the search results instead of the full image list
        if(query && querySubmitted) {
          images = stores.ApplicationStore.getSearchResultsFor(query);
        }

        if(images){
          return (
            <div>
              <input type="text"
                     placeholder="Search across image name, tag or description"
                     className="form-control search-input"
                     onChange={this.handleChange}
                     onKeyUp={this.handleKeyUp}
              />
              {this.renderFilterDescription(query)}
              <ImageList images={images} onClick={this.showImageDetails}/>
            </div>
          );
        }

        return (
          <div>
            <input type="text"
                   placeholder="Search across image name, tag or description"
                   className="form-control search-input"
                   onChange={this.handleChange}
                   onKeyUp={this.handleKeyUp}
            />
            {this.renderFilterDescription(query)}
            <div className="loading"/>
          </div>
        );
      },

      render: function () {
        return (
          <div>
            <div className="modal-body">
              {this.renderBody()}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger cancel-button" onClick={this.onPrevious}>
                Cancel
              </button>
            </div>
          </div>
        );
      }

    });

  });
