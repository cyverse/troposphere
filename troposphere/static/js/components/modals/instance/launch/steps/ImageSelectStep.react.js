import React from 'react';
import ReactDOM from 'react-dom';
import Backbone from 'backbone';
import _ from 'underscore';
import stores from 'stores';

import TabLinks from 'components/common/ui/TabLinks.react';
import ImageCollection from 'collections/ImageCollection';
import ImageList from '../components/ImageList.react';
import ComponentHandleInputWithDelay from 'components/mixins/ComponentHandleInputWithDelay';
import InstanceLaunchFooter from '../components/InstanceLaunchFooter.react';

export default React.createClass({
    displayName: 'InstanceLaunchWizardModal-ImageSelectStep',
    mixins: [ComponentHandleInputWithDelay],

    RESULTS_PER_PAGE: 20,
    FEATURED_VIEW: 0,
    FAVORITE_VIEW: 1,
    ALL_VIEW: 2,

    getInitialState: function() {
        return {
            images: null,
            query: null,
            view: this.FEATURED_VIEW,
            page: 1
        }
    },

    componentDidMount: function() {
        stores.ImageBookmarkStore.addChangeListener(this.updateState);
        stores.ImageStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
        this.focusSearchInput();

        // Here we have the option to prime the data, in the future
        // subscribing to a data source should do this automatically
        //
        // this.fetchAll();
        // this.fetchFeatured();
        // this.fetchFavorites();
    },

    componentWillUnmount: function() {
        stores.ImageBookmarkStore.removeChangeListener(this.updateState);
        stores.ImageStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        let images;
        switch (this.state.view) {
            case this.ALL_VIEW:
                images = this.fetchAll();
                break;
            case this.FEATURED_VIEW:
                images = this.fetchFeatured();
                break;
            case this.FAVORITE_VIEW:
                images = this.fetchFavorites();
                break;
        }
        this.setState({
            images
        });
    },

    onSearchChange: function(e) {
        let input = e.target.value.trim();

        // Skip the timeout, if the query is empty
        if (!input) {
            this.setState({
                query: input
            }, this.updateState);
        } else {

            // The callback will be called at least after 500 ms, if the
            // function is called again, its internal timer will be reset
            this.setState({
                query: input
            }, () => {
                this.callIfNotInterruptedAfter(500 /*ms*/ , this.updateState);
            });
        }

    },

    handleLoadMoreImages: function() {
        this.setState({
            page: this.state.page + 1
        })
    },

    onChangeView: function(view) {
        this.setState({
            view
        }, this.updateState);
    },

    fetchAll: function() {
        let query = this.state.query;
        let images;
        if (query) {
            images = stores.ImageStore.fetchWhere({
                search: query
            });
        } else {
            images = stores.ImageStore.getAll();
        }

        return images;
    },

    getAll: function() {
        let query = this.state.query;
        let images;
        if (query) {
            images = stores.ImageStore.getWhere({
                search: query
            });
        } else {
            images = stores.ImageStore.getAll();
        }

        return images;
    },

    fetchFeatured: function() {
        let query = this.state.query;
        let images;
        if (query) {
            images = stores.ImageStore.fetchWhere({
                tags__name: 'Featured',
                search: query
            });
        } else {
            images = stores.ImageStore.fetchWhere({
                tags__name: 'Featured'
            });
        }

        return images;
    },

    getFeatured: function() {
        let query = this.state.query;
        let images;
        if (query) {
            images = stores.ImageStore.getWhere({
                tags__name: 'Featured',
                search: query
            });
        } else {
            images = stores.ImageStore.getWhere({
                tags__name: 'Featured'
            });
        }

        return images;
    },

    fetchFavorites: function() {
        let query = this.state.query;
        let images;
        if (query) {
            images = stores.ImageStore.fetchWhere({
                bookmarked: true,
                search: query
            });
        } else {
            images = stores.ImageBookmarkStore.getBookmarkedImages();
        }

        return images;
    },

    getFavorites: function() {
        let query = this.state.query;
        let images;
        if (query) {
            images = stores.ImageStore.getWhere({
                bookmarked: true,
                search: query
            });
        } else {
            images = stores.ImageBookmarkStore.getBookmarkedImages();
        }

        return images;
    },

    renderFilterDescription: function(images, total) {
        let query = this.state.query;
        let view = this.state.view;
        total = total || 0;

        // Waiting on a network request, or user is typing
        if (!images || this.awaitingTimeout()) {
            return (
            // Note: this div collapses w/o nbsp
            <div className="filter-description">
                &nbsp;
            </div>
            );
        }

        let message;
        if (images.length === 0) {
            if (view == this.FAVORITE_VIEW) {
                message = 'No favorited images found';
            } else {
                message = 'No images found';
            }
        } else {
            if (total > images.length) {
                message = `Showing first ${images.length} images`;
            } else {
                message = `Showing ${images.length} image(s)`;
            }
        }

        if (query) {
            message += ` for "${query}"`;
        }

        return (
        <div className="filter-description">
            { message }
        </div>
        );
    },

    renderMoreImagesButton: function() {
        return (
        <li>
            <button style={ { 'margin': '15px auto', 'display': 'block' } } className="btn btn-default" onClick={ this.handleLoadMoreImages }>
                Show more images...
            </button>
        </li>
        );
    },

    focusSearchInput: function() {
        this.refs.searchField.focus();
    },

    renderSearchInput: function() {
        return (
        <input ref="searchField"
               type="text"
               placeholder="Search across image name, tag or description"
               className="form-control search-input"
               onChange={ this.onSearchChange } />
        );
    },

    // This render method is a good model for the future. It appears that no
    // network requests are being made, only gets (getAll, getFeat..).
    // However, BaseStore.getAll actually makes a network request on a cold
    // cache. So on first call these do actually make network requests. When
    // that bug is fixed, componentDidMount will have to prime the cache, this
    // will be done transparently. i.e. Subscribing to a data source will auto
    // populate that data source.
    renderImageTabView: function() {
        let tags = stores.TagStore.getAll();
        let query = this.state.query;
        let view = this.state.view;

        let images;
        switch (view) {
            case this.ALL_VIEW:
                images = this.getAll();
                break;
            case this.FEATURED_VIEW:
                images = this.getFeatured();
                break;
            case this.FAVORITE_VIEW:
                images = this.getFavorites();
                break;
        }

        // Render loading
        if (!(images && tags)) {
            return (
            <div>
                { this.renderSearchInput() }
                { this.renderFilterDescription() }
                <div className="loading" />
            </div>
            );
        }

        let numberOfResults = this.state.page * this.RESULTS_PER_PAGE;
        let shownImages = new ImageCollection(images.first(numberOfResults));

        return (
        <div>
            { this.renderSearchInput() }
            { this.renderFilterDescription(shownImages, images.length) }
            <ImageList images={ shownImages } onSelectImage={ this.props.onSelectImage }>
                { images.length > shownImages.length
                      ? this.renderMoreImagesButton()
                      : null }
            </ImageList>
        </div>
        );

    },

    render: function() {
        return (
        <div>
            <div className="modal-section">
                <h3 className="t-title">First choose an image for your instance</h3>
                <hr/>
                <TabLinks links={ ['Show Featured', 'Show Favorites', 'Show All'] } defaultLink={ this.FEATURED_VIEW } onTabClick={ this.onChangeView } />
                { this.renderImageTabView() }
            </div>
            <InstanceLaunchFooter showValidationErr={ true }
                                  onCancel={ this.props.onCancel }
                                  launchIsDisabled={ true }
                                  advancedIsDisabled={ true }
                                  backIsDisabled={ true } />
        </div>
        );

    }
});
