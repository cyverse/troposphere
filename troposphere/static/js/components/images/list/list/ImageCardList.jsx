import React from "react";
import Backbone from "backbone";
import ImageListCard from "../common/ImageListCard";
import {Toggle} from "material-ui";
import {filterEndDate} from "utilities/filterCollection";
import stores from "stores";

export default React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },
    getInitialState() {
        return {
            showEndDated: true
        };
    },
    renderTitle() {
        var title = this.props.title;
        if (!title) return;
        return <h3 className="t-title">{title}</h3>;
    },
    renderCard(image) {
        let isEndDated = !filterEndDate(image);
        let imageMetric = stores.ImageMetricsStore.get(image.id);

        return (
            <li key={image.id}>
                <ImageListCard
                    image={image}
                    metric={imageMetric}
                    isEndDated={isEndDated}
                />
            </li>
        );
    },
    renderToggle(showEndDated) {
        return (
            <div style={{float: "right", width: "150px"}}>
                <Toggle
                    label="Show End Dated"
                    onToggle={() =>
                        this.setState({
                            showEndDated: !showEndDated
                        })
                    }
                />
            </div>
        );
    },

    render() {
        const images = this.props.images;
        const {showEndDated} = this.state;
        const profile = stores.ProfileStore.get();
        const isStaff = profile.get("is_staff");
        const imageFilter = showEndDated ? filterEndDate : () => true;
        const imageCards = images.filter(imageFilter).map(this.renderCard);

        return (
            <div>
                <div className="clearfix">
                    {isStaff && this.renderToggle(showEndDated)}
                    {this.renderTitle()}
                </div>
                <ul className="app-card-list">{imageCards}</ul>
            </div>
        );
    }
});
