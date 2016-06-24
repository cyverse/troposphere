import React from 'react';
import Image from './Image.react';
import Backbone from  'backbone';

// We only use the ImageCollection for the prototype not data
import ImageCollection from 'collections/ImageCollection';
import { filterEndDate } from 'utilities/filterCollection';


export default React.createClass({
    displayName: "ImageList",

    propTypes: {
    images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
    onClick: React.PropTypes.func
    },

    renderImage: function (image) {
    return (
        <Image key={image.id} image={image} onSelectImage={this.props.onSelectImage}/>
    )
    },

    render: function () {
        let images = this.props.images.cfilter(filterEndDate);
        return (
            <ul className="app-card-list modal-list">
                {images.map(this.renderImage)}
                {this.props.children}
            </ul>
        );
    }
});
