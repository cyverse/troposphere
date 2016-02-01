import React from 'react/addons';
import Backbone from 'backbone';
import _ from 'underscore';
import ImageCollection from 'collections/ImageCollection';
import ImageList from '../components/ImageList.react';
import InstanceLaunchFooter from '../components/InstanceLaunchFooter.react';
import stores from 'stores';

export default React.createClass({
    displayName: "InstanceLaunchWizardModal-ImageSelectStep",

    getInitialState: function () {
        return {
            query: null,
            resultsPerPage: 20,
            page: 1
        }
    },

    componentDidMount: function () {
        stores.ImageStore.addChangeListener(this.triggerRenderOnStore);
        stores.TagStore.addChangeListener(this.triggerRenderOnStore);
        this.focusSearchInput();
    },

    componentWillUnmount: function () {
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

    renderFilterDescription: function () {
        let message,
            query = this.state.query;

        if (query) {
            message = 'Showing results for "' + query + '"';
        } else {
            message = "Showing first 20 images"
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
            />
        );
    },
    renderImages: function (images) {
        let imageCount = images.models.length,
            query = this.state.query;

        return (
        <div>
            {this.renderSearchInput()}
            {this.renderFilterDescription()}
            <ImageList images={images}
                onSelectImage={this.props.onSelectImage}
            >
            {this.renderMoreImagesButton(images, imageCount)}
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

        let images,
            tags = stores.TagStore.getAll(),
            query = this.state.query,
            numberOfResults,
            totalNumberOfImages;

        if (query) {
            images = stores.ImageStore.fetchWhere({
                search: query
            });
        } else {
            images = stores.ImageStore.getAll();
        }

        if (images && tags) {
            numberOfResults = this.state.page * this.state.resultsPerPage;

            images = images.first(numberOfResults);
            images = new ImageCollection(images);

            if (images.length > 0) {
                return this.renderImages(images);
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
