define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    stores = require('stores'),
    ApplicationCollection = require('collections/ApplicationCollection'),
    ApplicationCardList = require('./list/ApplicationCardList.react'),
    ApplicationCardGrid = require('./grid/ApplicationCardGrid.react'),
    SecondaryApplicationNavigation = require('../common/SecondaryApplicationNavigation.react'),
    Router = require('react-router');

  var timer,
    timerDelay = 100;

  return React.createClass({

    mixins: [Router.State],

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState: function () {
      return {
        originalQuery: this.getQuery().q,
        query: this.getQuery().q || "",
        input: this.getQuery().q || "",
        isLoadingMoreResults: false,
        nextUrl: null,
        viewType: 'list'
      }
    },

    componentWillReceiveProps: function (nextProps) {
      var query = this.getQuery().q;
      if (query !== this.state.originalQuery) {
        this.setState({query: query, input: query, originalQuery: query});
      }
    },

    updateState: function () {
      var query = this.state.query,
        state = {},
        images;

      if (query) {
        images = stores.ApplicationStore.fetchWhere({
          search: query
        })
      } else {
        images = stores.ApplicationStore.getAll();
      }

      if (images && images.meta.next !== this.state.nextUrl) {
        state.isLoadingMoreResults = false;
        state.nextUrl = null;
      }

      if (this.isMounted()) this.setState(state);
    },

    componentDidMount: function () {
      stores.ApplicationStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ApplicationStore.removeChangeListener(this.updateState);
    },

    onLoadMoreImages: function () {
      var query = this.state.query,
        images;

      // Get the current collection
      if (query) {
        images = stores.ApplicationStore.fetchWhere({
          search: query
        });
      } else {
        images = stores.ApplicationStore.getAll();
      }

      this.setState({
        isLoadingMoreResults: true,
        nextUrl: images.meta.next
      });

      // Fetch the next page of data
      if (query) {
        stores.ApplicationStore.fetchMoreWhere({
          search: query
        });
      } else {
        stores.ApplicationStore.fetchMore();
      }
    },

    //
    // Callbacks
    //

    handleSearch: function (input) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(function () {
        this.setState({query: this.state.input});
      }.bind(this), timerDelay);
    },

    onSearchChange: function (e) {
      var input = e.target.value;
      this.setState({input: input});
      this.handleSearch(input);
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

    renderFeaturedImages: function () {
      var images = stores.ApplicationStore.fetchWhere({
          tags__name: 'Featured'
        }),
        tags = this.props.tags;

      if (!images || !tags || this.state.query) return;

      if (this.state.viewType === "list") {
        return (
          <ApplicationCardList
            key="featured"
            title="Featured Images"
            applications={images}
            tags={tags}
            />
        );
      } else {
        return (
          <ApplicationCardGrid
            key="featured"
            title="Featured Images"
            applications={images}
            tags={tags}
            />
        );
      }
    },

    renderImages: function (applications) {
      var tags = this.props.tags;

      if (applications && tags) {
        if (this.state.viewType === "list") {
          return (
            <ApplicationCardList
              key="all"
              title="All Images"
              applications={applications}
              tags={tags}
              />
          );
        } else {
          return (
            <ApplicationCardGrid
              key="all"
              title="All Images"
              applications={applications}
              tags={tags}
              />
          );
        }
      }

      return (
        <div className="loading"></div>
      );
    },

    renderLoadMoreButton: function (applications) {
      if (this.state.isLoadingMoreResults) {
        return (
          <div style={{"margin": "auto", "display": "block"}} className="loading"/>
        )
      }

      if (applications.meta.next) {
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
        title = "",
        images;

      if (query) {
        images = stores.ApplicationStore.fetchWhere({
          search: query
        });
      } else {
        images = stores.ApplicationStore.getAll();
      }


      if (!images) return <div className="loading"></div>;

      title = "Showing " + images.length + " of " + images.meta.count + " images";

      if (query) title += " for '" + query + "'";

      return (
        <div>
          <div className="display-toggles clearfix">
            <h3>{title}</h3>

            <div className="btn-group pull-right">
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
        <div className="container application-card-view">
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
