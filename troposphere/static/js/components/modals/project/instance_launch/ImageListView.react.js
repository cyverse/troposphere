/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    './ImageList.react',
    'collections/ApplicationCollection'
  ],
  function (React, Backbone, stores, ImageList, ImageCollection) {

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
        var inputText = this.state ? this.state.inputText : null;
        var query = this.state ? this.state.query : null;
        var querySubmitted = this.state ? this.state.querySubmitted : false;
        return {
          inputText: inputText,
          query: query,
          querySubmitted: querySubmitted,
          images: stores.ApplicationStore.getAll(),
          tags: stores.TagStore.getAll(),

          resultsPerPage: 20,
          page: 1
        }
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

      componentDidMount: function () {
        stores.ApplicationStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      handleChange: function (e) {
        var text = e.target.value;
        this.setState({inputText: text});
      },

      handleKeyUp: function (e) {
        var query = this.state.inputText;
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

      handleLoadMoreImages: function(){
        this.setState({page: this.state.page + 1});
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
          <div className="filter-description">{message}</div>
        )
      },

      renderMoreImagesButton: function(images, totalNumberOfImages){
        if(images.models.length < totalNumberOfImages) {
          return (
            <li>
              <button style={{"margin": "15px auto", "display": "block"}} className="btn btn-default" onClick={this.handleLoadMoreImages}>
                Show more images...
              </button>
            </li>
          )
        }
      },

      renderBody: function(){
        var images = this.state.images,
            tags = this.state.tags,
            query = this.state.query,
            querySubmitted = this.state.querySubmitted,
            numberOfResults,
            totalNumberOfImages;

        // if a search has been requested, use the search results instead of the full image list
        if(query && querySubmitted) {
          images = stores.ApplicationStore.getSearchResultsFor(query);
        }

        if(images && tags){
          numberOfResults = this.state.page*this.state.resultsPerPage;
          totalNumberOfImages = images.models.length;

          images = images.first(numberOfResults);
          images = new ImageCollection(images);

          return (
            <div>
              <input type="text"
                     placeholder="Search across image name, tag or description"
                     className="form-control search-input"
                     onChange={this.handleChange}
                     onKeyUp={this.handleKeyUp}
              />
              {this.renderFilterDescription(query)}
              <ImageList images={images} onClick={this.showImageDetails}>
                {this.renderMoreImagesButton(images, totalNumberOfImages)}
              </ImageList>
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
              <button type="button" className="btn btn-danger cancel-button pull-left" onClick={this.onPrevious}>
                Cancel
              </button>
            </div>
          </div>
        );
      }

    });

  });
