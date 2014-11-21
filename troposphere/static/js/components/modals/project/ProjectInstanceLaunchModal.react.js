/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    './instance_launch/ImageList.react'
  ],
  function (React, Backbone, BootstrapModalMixin, stores, ImageList) {

    var ENTER_KEY = 13;

    return React.createClass({
      mixins: [BootstrapModalMixin],

      //
      // Mounting & State
      // ----------------
      //

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

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm();
      },

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
        this.setState({image: image})
      },

      //
      // Render
      // ------
      //

      renderImage: function(){
        return(
          <li></li>
        )
      },

      renderImageList: function(){
        return(
          <ul>
            {this.state.images.map(this.renderImage)}
          </ul>
        )
      },

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
              <input className="search-bar" onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
              {this.renderFilterDescription(query)}
              <ImageList images={images} onClick={this.showImageDetails}/>
            </div>
          );
        }

        return (
          <div>
            <input className="search-bar" onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
            {this.renderFilterDescription(query)}
            <div className="loading"/>
          </div>
        );
      },

      render: function () {
        var image = this.state.image;

        if(image){
          return (
            <div>Image details</div>
          )
        }

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Launch Image</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
