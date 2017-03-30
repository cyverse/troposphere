import React from "react";
import Backbone from "backbone";
import stores from "stores";
import ImageCardList from "./list/ImageCardList";
import ComponentHandleInputWithDelay from "components/mixins/ComponentHandleInputWithDelay";
import Router from "react-router";

export default React.createClass({

    displayName: "ImageListView",

    mixins: [Router.State, ComponentHandleInputWithDelay],

    propTypes: {
        tags: React.PropTypes.instanceOf(Backbone.Collection),
        query: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            query: this.props.query || "",
            isLoadingMoreResults: false,
            nextUrl: null,
            viewType: "list",
        }
    },

    componentWillReceiveProps(newProps) {
        // This is an important edge case. Several things can effect the query
        // for this component:
        //
        //    - a user types in the search bar
        //    - a parent component sets query=SomeTagName
        //
        // That means that we have to listen for props
        if (newProps.query != this.props.query) {
            this.setState({
                query: newProps.query
            });
        }
    },

    updateState: function() {
        let query = this.state.query.trim();
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
            isLoadingMoreResults,
            nextUrl,
        });

    },

    componentDidMount: function() {
        stores.ImageStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ImageStore.removeChangeListener(this.updateState);
    },

    onLoadMoreImages: function() {
        var query = this.state.query.trim(),
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

    onSearchChange: function(e) {
        var input = e.target.value;
        this.setState({
            query: input
        }, () => {
            this.callIfNotInterruptedAfter(500 /* ms */ , this.updateState);
        });
    },


    // --------------
    // Render methods
    // --------------

    renderFeaturedImages: function() {
        var images = stores.ImageStore.fetchWhere({
                tags__name: "Featured"
            }),
            tags = this.props.tags;

        // If a query is present, bail
        if (!images || !tags || this.state.query) return;

            return (
                <ImageCardList key="featured"         
                    title="Featured Images"
                    images={images}
                    tags={tags} />
            );
    },

    renderImages: function(images) {
        var tags = this.props.tags;

        if (images && tags) {
            return (
                <ImageCardList key="all"
                    title="All Images"
                    images={images}
                    tags={tags} />
            );
        }

        return (
        <div className="loading"></div>
        );
    },

    renderLoadMoreButton: function(images) {
        if (this.state.isLoadingMoreResults) {
            return (
            <div style={{ "margin": "auto", "display": "block" }} className="loading" />
            )
        }

        if (images.meta && images.meta.next) {
            return (
            <button style={{ "margin": "auto", "display": "block" }} className="btn btn-default" onClick={this.onLoadMoreImages}>
                Show more images...
            </button>
            )
        }
    },

    renderBody: function() {
        var query = this.state.query.trim(),
            title = "";

        let images;
        let searchParams = query ? { search: query } : {};
        images = stores.ImageStore.fetchWhere(searchParams);

        if (!images || this.awaitingTimeout()) {
            return <div className="loading"></div>;
        }

        if (!images.meta || !images.meta.count) {
            title = "Showing " + images.length + " images";
        } else {
            title = "Showing " + images.length + " of " + images.meta.count + " images";
        }
        if (query)
            title += " for '" + query + "'";

        return (
        <div>
            <div style={{ marginBottom: "30px" }} className="t-body-2">
                {title}
            </div>
            {this.renderFeaturedImages()}
            {this.renderImages(images)}
            {this.renderLoadMoreButton(images)}
        </div>
        );
    },

    render: function() {
        return (
        <div className="container image-card-view">
            <h1 className="t-display-1">
                Image Search
            </h1>
            <div id="search-container">
                <input type="text"
                    className="form-control search-input"
                    placeholder="Search across image name, tag or description"
                    onChange={this.onSearchChange}
                    value={this.state.query}
                    ref="textField" />
            </div>
            {this.renderBody()}
        </div>
        );
    }

});
