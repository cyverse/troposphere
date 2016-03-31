import React from 'react';
import ReactDOM from 'react-dom';
import Backbone from 'backbone';
import _ from 'underscore';
import stores from 'stores';

import TabLinks from 'components/common/ui/TabLinks.react';
import ImageCollection from 'collections/ImageCollection';
import ImageList from '../components/ImageList.react';
import InstanceLaunchFooter from '../components/InstanceLaunchFooter.react';

export default React.createClass({
    displayName: "InstanceLaunchWizardModal-ImageSelectStep",
    views: ['Show Featured', 'Show Favorites', 'Show All'],

    getInitialState: function () {
        return {
            listView: this.views[0],
            query: null,
            resultsPerPage: 20,
            page: 1
        }
    },

    componentDidMount: function () {
        stores.ImageBookmarkStore.addChangeListener(this.triggerRenderOnStore);
        stores.ImageStore.addChangeListener(this.triggerRenderOnStore);
        stores.TagStore.addChangeListener(this.triggerRenderOnStore);
        this.focusSearchInput();
    },

    componentWillUnmount: function () {
        stores.ImageBookmarkStore.removeChangeListener(this.triggerRenderOnStore);
        stores.ImageStore.removeChangeListener(this.triggerRenderOnStore);
        stores.TagStore.removeChangeListener(this.triggerRenderOnStore);
    },

    triggerRenderOnStore: function() {
        this.setState({})
    },

    handleChange: function(e) {
        this.setState({query: e.target.value})
    },

    handleLoadMoreImages: function() {
        this.setState({page: this.state.page + 1})
    },

    onChangeView: function(listView) {
        this.setState({
            listView
        });
    },

    showAll: function() {
        let query = this.state.query;
        let images = stores.ImageStore.getAll();
        if (query) {
            images = stores.ImageStore.fetchWhere({
                search: query
            });
        }

        return images
    },

    showFeatured: function() {
        let query = this.state.query;
        let images = stores.ImageStore.fetchWhere({
            tags__name: 'Featured'
        });
        if (query) {
            images = stores.ImageStore.fetchWhere({
                tags__name: 'Featured',
                search: query
            });
        }

        return images
    },

    showFavorites: function() {
        let query = this.state.query;
        let images = stores.ImageStore.fetchWhere({
            bookmarked: true
        });
        if (query) {
            images = stores.ImageStore.fetchWhere({
                bookmarked: true,
                search: query
            });
        }

        return images
    },

    imageList: function() {
        let listView = this.state.listView;
        switch(listView) {
            case 'Show All': return this.showAll()
            case 'Show Featured': return this.showFeatured()
            case 'Show Favorites': return this.showFavorites()
        }
    },

    renderFilterDescription: function (images) {
        let message;
        let query = this.state.query;
        let queryText = "";
        if (query) { queryText = `for "${query}"` }
        if (images) {
            if (images.length >= 20) {
                message = `Showing first ${images.length} images ${queryText}`;
            }
            else {
                message = `Showing ${images.length} image(s) ${queryText}`;
            }
        }

        return (
            <div className="filter-description">{message}</div>
        );
    },

    renderNoResultsFor: function () {
        let query = this.state.query,
            message = 'No images found matching "' + query + '"';

        return (
            <div className="filter-description">{message}</div>
        );
    },

    renderMoreImagesButton: function (images, totalNumberOfImages) {
        if (images.length < totalNumberOfImages) {
            return (
                <li>
                    <button style={{
                        "margin": "15px auto",
                        "display": "block"
                    }} className="btn btn-default" onClick={this.handleLoadMoreImages}>
                        Show more images...
                    </button>
                </li>
            );
        }
    },

    focusSearchInput: function () {
        this.refs.searchField.focus();
    },
    renderSearchInput: function () {
        return (
            <input
                ref="searchField"
                type="text"
                placeholder="Search across image name, tag or description"
                className="form-control search-input"
                onChange={this.handleChange}
            />
        );
    },
    renderImages: function (images, allImages) {
        let totalNumberOfImages = allImages.length;
        let query = this.state.query;
        let searchInput = this.renderSearchInput();
        if (!images) { return ( <div className="loading"/> ) }
        
        return (
        <div>
            {searchInput}
            {this.renderFilterDescription(images)}
            <ImageList
                images={images}
                onSelectImage={this.props.onSelectImage}
            >
            {this.renderMoreImagesButton(images, totalNumberOfImages)}
            </ImageList>
        </div>
        );
    },
    renderZeroImages: function () {
        return (
        <div>
            {this.renderSearchInput()}
            {this.renderNoResultsFor()}
        </div>
        );
    },
    renderLoadingImages: function () {
        return (
        <div>
            {this.renderSearchInput()}
            {this.renderFilterDescription()}
            <div className="loading"/>
        </div>
        );
    },

    renderBody: function () {
        let allImages = this.imageList(),
            // This might get paginated below
            images = this.imageList(),
            tags = stores.TagStore.getAll(),
            query = this.state.query,
            numberOfResults,
            totalNumberOfImages;

        // Render Images
        if (images && tags) {
            numberOfResults = this.state.page * this.state.resultsPerPage;

            images = images.first(numberOfResults);
            images = new ImageCollection(images);

            if (images.length > 0) {
                return this.renderImages(images, allImages);
            } else {
                return this.renderZeroImages();
            }
        }
        return this.renderLoadingImages();
    },

    render: function () {
        return (
            <div>
                <div className="modal-section">
                    <h3 className="t-title">First choose an image for your instance</h3>
                    <hr/>
                    <TabLinks 
                        linkList={this.views}
                        currentView={this.state.listView}
                        onChangeView={this.onChangeView}
                    />
                    {this.renderBody()}
                </div>
                <InstanceLaunchFooter
                    showValidationErr={true}
                    onCancel={this.props.onCancel}
                    launchIsDisabled={true}
                    advancedIsDisabled={true}
                    backIsDisabled={true}
                />
            </div>
        );

    }
});
