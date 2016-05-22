define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    stores = require('stores'),
    ImageCollection = require('collections/ImageCollection'),
    ImageCardList = require('./list/ImageCardList.react'),
    ImageCardGrid = require('./grid/ImageCardGrid.react'),
    ComponentHandleInputWithDelay = require('components/mixins/ComponentHandleInputWithDelay'),
    SecondaryImageNavigation = require('../common/SecondaryImageNavigation.react'),
    Router = require('react-router');

  return React.createClass({

    displayName: "ImageListView",
    mixins: [Router.State, ComponentHandleInputWithDelay],

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState: function () {
      return {
        query: null,
        images: null,
        isLoadingMoreResults: false,
        nextUrl: null,
        viewType: 'list'
      }
    },

    updateState: function () {
        let query = this.state.query;

        let images;
        if (query) {
            images = stores.ImageStore.fetchWhere({
                search: query
            })
        } else {
            images = stores.ImageStore.getAll();
        }

        let isLoadingMoreResults = this.state.isLoadingMoreResults;
        let nextUrl = this.state.nextUrl;
        if (images && images.meta && images.meta.next !== this.state.nextUrl) {
            isLoadingMoreResults = false;
            nextUrl = null;
        }

        this.setState({
            images,
            isLoadingMoreResults,
            nextUrl,
        });

    },

    componentDidMount: function () {
      stores.ImageStore.addChangeListener(this.updateState);

      // Prime the data
      this.updateState();
    },

    componentWillUnmount: function() {
      stores.ImageStore.removeChangeListener(this.updateState);
    },

    onLoadMoreImages: function () {
      var query = this.state.query,
        images;

      // Get the current collection
      if (query) {
        images = stores.ImageStore.fetchWhere({
          search: query
        });
      } else {
        images = stores.ImageStore.getAll();
      }

      this.setState({
          images,
          isLoadingMoreResults: true,
          nextUrl: images.meta.next
      });

      // Fetch the next page of data
      if (query) {
        stores.ImageStore.fetchMoreWhere({
          search: query
        });
      } else {
        stores.ImageStore.fetchMore();
      }
    },

    //
    // Callbacks
    //

    onSearchChange: function (e) {
      var input = e.target.value.trim();

      // If input is empty string, don't bother with delay
      if (!input) {
          this.setState({query: input}, this.updateState);
      } else {
          this.setState({query: input}, () => {
              this.callIfNotInterruptedAfter(500 /* ms */, this.updateState);
          });
      }
    },

    onChangeViewType: function () {
      if (this.state.viewType === "list") {
        this.setState({viewType: 'grid'});
      } else {
        this.setState({viewType: 'list'});
      }
    },

    // --------------
    // Render methods
    // --------------

    renderFeaturedImages: function() {
      var images = stores.ImageStore.fetchWhere({
            tags__name: 'Featured'
          }),
          tags = this.props.tags;

      // If a query is present, bail
      if (!images || !tags || this.state.query) 
          return;

      if (this.state.viewType === "list") {
        return (
          <ImageCardList
            key="featured"
            title="Featured Images"
            images={images}
            tags={tags}
            />
        );
      } else {
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

    renderImages: function(images) {
      var tags = this.props.tags;

      if (images && tags) {
        if (this.state.viewType === "list") {
          return (
            <ImageCardList
              key="all"
              title="All Images"
              images={images}
              tags={tags}
              />
          );
        } else {
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

    renderLoadMoreButton: function(images) {
      if (this.state.isLoadingMoreResults) {
        return (
          <div style={{"margin": "auto", "display": "block"}} className="loading"/>
        )
      }

      if (images.meta && images.meta.next) {
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

    renderListButton: function () {
      var classValues = "btn btn-default",
        onClick = this.onChangeViewType;

      if (this.state.viewType === "list") {
        classValues += " active";
        onClick = function () {
        };
      }

      return (
        <button type="button" className={classValues} onClick={onClick}>
          <span className="glyphicon glyphicon-align-justify"></span> List
        </button>
      );
    },

    renderGridButton: function () {
      var classValues = "btn btn-default",
        onClick = this.onChangeViewType;

      if (this.state.viewType === "grid") {
        classValues += " active";
        onClick = function () {
        };
      }

      return (
        <button type="button" className={classValues} onClick={onClick}>
          <span className="glyphicon glyphicon-th"></span> Grid
        </button>
      );
    },

    renderBody: function () {
      var query = this.state.query,
        title = "";

        let images;
        if (query) {
            images = stores.ImageStore.getWhere({
                search: query
            })
        } else {
            images = stores.ImageStore.getAll();
        }

      if (!images || this.awaitingTimeout()) {
          return <div className="loading"></div>;
      }

      if (!images.meta || !images.meta.count) {
          title = "Showing " + images.length + " images";
      } else {
          title = "Showing " + images.length + " of " + images.meta.count + " images";
      }
      if (query) title += " for '" + query + "'";

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
              value={this.state.query}
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
