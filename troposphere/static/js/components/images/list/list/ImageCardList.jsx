import React from "react";
import Backbone from "backbone";
import { withRouter } from "react-router";
import ImageListCard from "../common/ImageListCard";
import { filterEndDate } from "utilities/filterCollection";
import stores from "stores";

const ImageCardList = React.createClass({

    propTypes: {
        title: React.PropTypes.string,
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    onCardClick(image) {
        this.props.router.push(`images/${image.id}`);
    },

    renderTitle: function() {
        var title = this.props.title;
        if (!title) return;

        return (
        <h3 className="t-title">{title}</h3>
        )
    },

    renderCard: function(image) {
        let isEndDated = !filterEndDate(image);
        let imageMetric = stores.ImageMetricsStore.get(image.id);

        return (
        <li key={image.id}>
            <ImageListCard
                image={image}
                metric={imageMetric}
                isEndDated={isEndDated}
                onCardClick={ this.onCardClick }
            />
        </li>
        );
    },

    render: function() {
        var images = this.props.images;
        var imageCards = images.map(this.renderCard);

        return (
        <div>
            {this.renderTitle()}
            <ul className="app-card-list">
                {imageCards}
            </ul>
        </div>
        );
    }
});

export default withRouter(ImageCardList);
