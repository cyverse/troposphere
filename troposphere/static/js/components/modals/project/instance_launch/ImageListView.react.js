/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    'components/common/image/ImageList.react',
    'collections/ApplicationCollection'
  ],
  function (React, Backbone, stores, ImageList, ImageCollection) {

    var timer,
        timerDelay = 100;

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //a

      propTypes: {
        onPrevious: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired
      },

      getInitialState: function(){
        return this.getState();
      },

      getState: function() {
        var query = this.state ? this.state.query : null,
            images;
        if(query){
          images = stores.ApplicationStore.fetchWhere({
            search: query
          });
        }else{
          images = stores.ApplicationStore.getAll();
        }

        return {
          query: query,
          images: images,
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

      handleSearch: function (query) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function(){
          query = this.state.query;
          if(query) {
            this.setState({
              images: stores.ApplicationStore.fetchWhere({
                search: query
              })
            });
          }else{
            this.setState({
              images: stores.ApplicationStore.getAll()
            });
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

      renderNoResultsFor: function(query){
        var message = 'No images found matching "' + query + '"';

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
            numberOfResults,
            totalNumberOfImages;

        // if a search has been requested, use the search results instead of the full image list
        //if(query) {
        //  images = stores.ApplicationStore.getSearchResultsFor(query);
        //}

        if(images && tags){
          numberOfResults = this.state.page*this.state.resultsPerPage;
          totalNumberOfImages = images.models.length;

          images = images.first(numberOfResults);
          images = new ImageCollection(images);

          if(images.length > 0) {
            return (
              <div>
                <input
                  type="text"
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
          }else{
            return (
              <div>
                <input
                  type="text"
                  placeholder="Search across image name, tag or description"
                  className="form-control search-input"
                  onChange={this.handleChange}
                  onKeyUp={this.handleKeyUp}
                />
                {this.renderNoResultsFor(query)}
              </div>
            );
          }
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
              <button type="button" className="btn btn-danger cancel-button pull-left" onClick={this.onBack}>
                Cancel
              </button>
            </div>
          </div>
        );
      }

    });

  });
