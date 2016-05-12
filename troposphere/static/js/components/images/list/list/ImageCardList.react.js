import React from 'react/addons';
import { filterEndDate } from 'utilities/filterCollection';
import ImageListCard from '../common/ImageListCard.react';

export default React.createClass({

    propTypes: {
        title: React.PropTypes.string,
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    renderTitle: function () {
        var title = this.props.title;
        if (!title) return;

        return (
        <h3>{title}</h3>
        )
    },

    renderCard: function(image){
        let isEndDated = !filterEndDate(image);
        return (
        <li key={image.id}>
            <ImageListCard
            image={image}
            isEndDated = {isEndDated}
            />
        </li>
        );
    },

    render: function () {
        var images = this.props.images;
        var imageCards = images.map(this.renderCard);

        return (
        <div>
            {this.renderTitle()}
            <ul className='app-card-list'>
            {imageCards}
            </ul>
        </div>
        );
    }

});

