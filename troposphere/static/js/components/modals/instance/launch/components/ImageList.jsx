import React from "react";
import Image from "components/images/list/common/ImageListCard";
import Backbone from "backbone";

export default React.createClass({
    displayName: "ImageList",

    propTypes: {
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onClick: React.PropTypes.func
    },

    getInitialState() {
        return {
            isOpen: null
        }
    },

    onOpen(image) {
        console.log("clicked")
        const isOpen = this.state.isOpen === image ?
            null : image; 
        this.setState({ isOpen })
    },

    renderImage: function(image) {
        return (
        <Image
            key={image.id}
            image={image}
            isOpen={ this.state.isOpen === image }
            onCardClick={ this.onOpen.bind(this, image) }
            onSelectImage={this.props.onSelectImage} />
        )
    },

    render: function() {
        let images = this.props.images;
        return (
        <ul className="app-card-list modal-list">
            {images.map(this.renderImage)}
            {this.props.children}
        </ul>
        );
    }
});
