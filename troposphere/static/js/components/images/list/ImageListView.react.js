define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      ImageCollection = require('collections/ImageCollection'),
      ImageCardList = require('./list/ImageCardList.react'),
      ImageCardGrid = require('./grid/ImageCardGrid.react'),
      SecondaryImageNavigation = require('../common/SecondaryImageNavigation.react'),
      Router = require('react-router');

  var timer,
      timerDelay = 100;

  return React.createClass({

    mixins: [Router.State],

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState: function(){
      return {
        originalQuery: this.getQuery().q,
        query: this.getQuery().q || "",
        input: this.getQuery().q || "",
        isLoadingMoreResults: false,
        nextUrl: null,
        viewType: 'list'
      }
    },

    componentWillReceiveProps: function(nextProps){
      var query = this.getQuery().q;
      if(query !== this.state.originalQuery){
        this.setState({query: query, input: query, originalQuery: query});
      }
    },

    updateState: function() {
      var query = this.state.query,
          state = {},
          images;

      if(query){
        images = stores.ImageStore.fetchWhere({
          search: query
        })
      }else{
        images = stores.ImageStore.getAll();
      }

      if(images && images.meta.next !== this.state.nextUrl){
        state.isLoadingMoreResults = false;
        state.nextUrl = null;
      }

      if (this.isMounted()) this.setState(state);
    },

    componentDidMount: function () {
      stores.ImageStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.ImageStore.removeChangeListener(this.updateState);
    },

    onLoadMoreImages: function(){
      var query = this.state.query,
          images;

      // Get the current collection
      if(query){
        images = stores.ImageStore.fetchWhere({
          search: query
        });
      }else{
        images = stores.ImageStore.getAll();
      }

      this.setState({
        isLoadingMoreResults: true,
        nextUrl: images.meta.next
      });

      // Fetch the next page of data
      if(query){
        stores.ImageStore.fetchMoreWhere({
          search: query
        });
      }else{
        stores.ImageStore.fetchMore();
      }
    },

    //
    // Callbacks
    //

    handleSearch: function (input) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(function(){
        this.setState({query: this.state.input});
      }.bind(this), timerDelay);
    },

    onSearchChange: function (e) {
      var input = e.target.value;
      this.setState({input: input});
      this.handleSearch(input);
    },

    onChangeViewType: function(){
      if(this.state.viewType === "list"){
        this.setState({viewType: 'grid'});
      }else{
        this.setState({viewType: 'list'});
      }
    },

    // --------------
    // Render methods
    // --------------

    renderFeaturedImages: function(){
      var images = stores.ImageStore.fetchWhere({
            tags__name: 'Featured'
          }),
          tags = this.props.tags;

      if (!images || !tags || this.state.query) return;

      if(this.state.viewType === "list") {
        return (
          <ImageCardList
            key="featured"
            title="Featured Images"
            images={images}
            tags={tags}
          />
        );
      }else{
        return (
          <ImageCardGrid
            key="featured"
            title="Featured Images"
            images={images}
            tags={tags}
          />
        );
      }
    },

    renderImages: function(images){
      var tags = this.props.tags;

      if (images && tags) {
        if(this.state.viewType === "list") {
          return (
            <ImageCardList
              key="all"
              title="All Images"
              images={images}
              tags={tags}
            />
          );
        }else{
          return (
            <ImageCardGrid
              key="all"
              title="All Images"
              images={images}
              tags={tags}
            />
          );
        }
      }

      return (
        <div className="loading"></div>
      );
    },

    renderLoadMoreButton: function(images){
      if(this.state.isLoadingMoreResults){
        return (
          <div style={{"margin": "auto", "display": "block"}} className="loading"/>
        )
      }

      if(images.meta.next) {
        return (
          <button
            style={{"margin": "auto", "display": "block"}}
            className="btn btn-default"
            onClick={this.onLoadMoreImages}
          >
            Show more images...
          </button>
        )
      }
    },

    renderListButton: function(){
      var classValues = "btn btn-default",
          onClick = this.onChangeViewType;

      if(this.state.viewType === "list") {
        classValues += " active";
        onClick = function(){};
      }

      return (
        <button type="button" className={classValues} onClick={onClick}>
          <span className="glyphicon glyphicon-align-justify"></span> List
        </button>
      );
    },

    renderGridButton: function(){
      var classValues = "btn btn-default",
          onClick = this.onChangeViewType;

      if(this.state.viewType === "grid") {
        classValues += " active";
        onClick = function(){};
      }

      return (
        <button type="button" className={classValues} onClick={onClick}>
          <span className="glyphicon glyphicon-th"></span> Grid
        </button>
      );
    },

    renderBody: function(){
      var query = this.state.query,
          title = "",
          images;

      if(query){
        images = stores.ImageStore.fetchWhere({
          search: query
        });
      }else{
        images = stores.ImageStore.getAll();
      }


      if (!images) return <div className="loading"></div>;

      title = "Showing " + images.length + " of " + images.meta.count + " images";

      if(query) title += " for '" + query + "'";

      return (
        <div>
          <div className="display-toggles clearfix">
            <h3>{title}</h3>
            <div className="btn-group pull-right hidden-xs hiddin-sm">
              {this.renderListButton()}
              {this.renderGridButton()}
            </div>
          </div>
          {this.renderFeaturedImages()}
          {this.renderImages(images)}
          {this.renderLoadMoreButton(images)}
        </div>
      );
    },

    render: function () {
      return (
        <div className="container image-card-view">
          <div id='search-container'>
            <input
              type='text'
              className='form-control search-input'
              placeholder='Search across image name, tag or description'
              onChange={this.onSearchChange}
              value={this.state.input}
              ref="textField"
            />
            <hr/>
          </div>
          {this.renderBody()}
        </div>
      );
    }

  });

});
