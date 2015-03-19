define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      ApplicationCollection = require('collections/ApplicationCollection'),
      ApplicationCardList = require('./list/ApplicationCardList.react'),
      ApplicationCardGrid = require('./grid/ApplicationCardGrid.react'),
      SecondaryApplicationNavigation = require('../common/SecondaryApplicationNavigation.react');

  var timer,
      timerDelay = 100;

  return React.createClass({

    propTypes: {
      query: React.PropTypes.string,
      tags: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getDefaultProps: function(){
      return {
        query: ""
      }
    },

    getInitialState: function(){
      return {
        applications: stores.ApplicationStore.getAll(),
        featuredImages: stores.ApplicationStore.getAllFeatured(),
        query: this.props.query,
        isLoadingMoreResults: false,
        nextUrl: null,
        viewType: 'list'
      }
    },

    getState: function() {
      return {
        applications: stores.ApplicationStore.getSearchResultsFor(this.state.query),
        featuredImages: stores.ApplicationStore.getAllFeatured()
      }
    },

    updateState: function() {
      var state = this.getState();
      if(state.applications.meta.next !== this.state.nextUrl){
        state.isLoadingMoreResults = false;
        state.nextUrl = null;
      }
      if (this.isMounted()) this.setState(state);
    },

    componentDidMount: function () {
      stores.ApplicationStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.ApplicationStore.removeChangeListener(this.updateState);
    },

    onLoadMoreImages: function(){
      this.setState({
        isLoadingMoreResults: true,
        nextUrl: this.state.applications.meta.next
      });
      if(this.state.query){
        stores.ApplicationStore.getMoreSearchResultsFor(this.state.query);
      }else{
        stores.ApplicationStore.getMoreImages();
      }
    },

    //
    // Callbacks
    //

    handleSearch: function (query) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(function(){
        var query = this.state.query,
            applications = stores.ApplicationStore.getSearchResultsFor(query);
        this.setState({applications: applications});
      }.bind(this), timerDelay);
    },

    onSearchChange: function (e) {
      this.setState({query: e.target.value});
    },

    onSearchKeyUp: function (e) {
      this.handleSearch(this.state.query);
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
      var images = this.state.featuredImages,
          tags = this.props.tags;

      if (images && tags) {
        if(this.state.viewType === "list") {
          return (
            <ApplicationCardList
              key="featured"
              title="Featured Images"
              applications={images}
              tags={tags}
            />
          );
        }else{
          return (
            <ApplicationCardGrid
              key="featured"
              title="Featured Images"
              applications={images}
              tags={tags}
            />
          );
        }
      }
    },

    renderImages: function(applications){
      var tags = this.props.tags;

      if (applications && tags) {
        if(this.state.viewType === "list") {
          return (
            <ApplicationCardList
              key="all"
              title="All Images"
              applications={applications}
              tags={tags}
            />
          );
        }else{
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

    renderLoadMoreButton: function(applications){
      if(this.state.isLoadingMoreResults){
        return (
          <div style={{"margin": "auto", "display": "block"}} className="loading"/>
        )
      }

      if(applications.meta.next) {
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
      var classValues = "btn btn-default";
      if(this.state.viewType === "list") classValues += " active";

      return (
        <button type="button" className={classValues} onClick={this.onChangeViewType}>
          <span className="glyphicon glyphicon-align-justify"></span> List
        </button>
      );
    },

    renderGridButton: function(){
      var classValues = "btn btn-default";
      if(this.state.viewType === "grid") classValues += " active";

      return (
        <button type="button" className={classValues} onClick={this.onChangeViewType}>
          <span className="glyphicon glyphicon-th"></span> Grid
        </button>
      );
    },

    renderBody: function(){
      var applications = this.state.applications,
          title = "";

      if (applications) {
        title = "Showing " + applications.length + " of " + applications.meta.count + " images";
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
            {this.renderImages(applications)}
            {this.renderLoadMoreButton(applications)}
          </div>
        );
      }

      return (
        <div className="loading"></div>
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
              value={this.props.value}
              onKeyUp={this.onSearchKeyUp}
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
