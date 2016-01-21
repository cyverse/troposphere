import React from 'react/addons';
import Backbone from 'backbone';
import _ from 'underscore';
import ImageCollection from 'collections/ImageCollection';
import ImageList from '../components/ImageList.react';
import InstanceLaunchFooter from '../components/InstanceLaunchFooter.react';
import stores from 'stores';

let timer,
    timerDelay = 100;

export default React.createClass({
    displayName: "InstanceLaunchWizardModal-ImageSelectStep",

    //
    // Mounting & State
    // ----------------
    //

    propTypes: {
    },

    getInitialState: function () {
        return this.getState();
    },

    getState: function () {
        let query = this.state ? this.state.query : null,
            images;
        if (query) {
            images = stores.ImageStore.fetchWhere({
                search: query
            });
        } else {
            images = stores.ImageStore.getAll();
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
        stores.ImageStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
        this.focusSearchInput();
    },

    componentWillUnmount: function () {
        stores.ImageStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //
    handleSearch: function (query) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
            query = this.state.query;
            if (query) {
                this.setState({
                    images: stores.ImageStore.fetchWhere({
                        search: query
                    })
                });
            } else {
                this.setState({
                    images: stores.ImageStore.getAll()
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

    showImageDetails: function (image) {
        this.props.onNext({image: image});
    },

    //
    // Callbacks
    //

    onBack: function () {
        this.props.onPrevious({});
    },

    handleLoadMoreImages: function () {
        this.setState({page: this.state.page + 1});
    },

    //
    // Render
    // ------
    //

    renderFilterDescription: function (query) {
        let message;

        if (query) {
            message = 'Showing results for "' + query + '"';
        } else {
            message = "Showing first 20 images"
        }

        return (
            <div className="filter-description">{message}</div>
        );
    },

    renderNoResultsFor: function (query) {
        let message = 'No images found matching "' + query + '"';

        return (
            <div className="filter-description">{message}</div>
        );
    },

    renderMoreImagesButton: function (images, totalNumberOfImages) {
        if (images.models.length < totalNumberOfImages) {
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
        this.refs.searchField.getDOMNode().focus();
    },
    renderSearchInput: function () {
        return (
            <input
                ref="searchField"
                type="text"
                placeholder="Search across image name, tag or description"
                className="form-control search-input"
                onChange={this.handleChange}
                onKeyUp={this.handleKeyUp}
            />
        );
    },
    renderImages: function (query, images) {
        let imageCount = images.models.length;

        return (
        <div>
            {this.renderSearchInput()}
            {this.renderFilterDescription(query)}
            <ImageList images={images} 
                onSelectImage={this.props.onSelectImage}
            >
            {this.renderMoreImagesButton(images, imageCount)}
            </ImageList>
        </div>
        );
    },
    renderZeroImages: function (query) {
        return (
        <div>
            {this.renderSearchInput()}
            {this.renderNoResultsFor(query)}
        </div>
        );
    },
    renderLoadingImages: function (query) {
        return (
        <div>
            {this.renderSearchInput()}
            {this.renderFilterDescription(query)}
            <div className="loading"/>
        </div>
        );
    },
    renderBody: function () {
        let images = this.state.images,
        tags = this.state.tags,
        query = this.state.query,
        numberOfResults,
        totalNumberOfImages;

        if (images && tags) {
        numberOfResults = this.state.page * this.state.resultsPerPage;

        images = images.first(numberOfResults);
        images = new ImageCollection(images);

        if (images.length > 0) {
            return this.renderImages(query, images);
        } else {
            return this.renderZeroImages(query);
        }
        }
        return this.renderLoadingImages(query);
    },
    render: function () {
        return (
            <div>
                <div className="modal-section">
                    <h3 className="t-title">First choose an image for your instance</h3>
                    <hr/>
                    {this.renderBody()}
                </div>
                <InstanceLaunchFooter 
                    onCancel={this.props.onCancel}
                    launchIsDisabled={true}
                    advancedIsDisabled={true}
                    backIsDisabled={true}
                />
            </div>
        );

    }

});
