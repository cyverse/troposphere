import React from 'react';
import backbone from  'backbone';

// We only use the ImageCollection for the pototype not data
import ImageCollection from 'collections/ImageCollection';
import { filterEndDate } from 'utilities/filterCollection';

import Image from './Image.react';

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
