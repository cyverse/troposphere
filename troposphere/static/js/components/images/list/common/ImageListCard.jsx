import React from "react";
import { withRouter } from "react-router";
import Backbone from "backbone";
import moment from "moment";

import Gravatar from "components/common/Gravatar";
import MediaCard from "components/common/ui/MediaCard";
import Bookmark from "components/images/common/Bookmark";
import Tags from "components/images/detail/tags/Tags";
import Showdown from "showdown";
import context from "context";
import globals from "globals";
import stores from "stores";
import Ribbon from "components/common/Ribbon";


const ImageListCard = React.createClass({
    displayName: "ImageListCard",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        metric: React.PropTypes.instanceOf(Backbone.Model),
    },

    onCardClick() {
        let imageId = this.props.image.id;

        this.props.router.push(`images/${imageId}`);
    },

    renderEndDated() {
        if (this.props.isEndDated) {
            return (
                <Ribbon text={ "End Dated" }/>
            );
        }
    },
    getLabels(metric) {
        let labels = Object.keys(metric);
        return labels;
    },
    getChartData(image, metric) {
        let metric_values = Object.values(metric);
        let percentAreaData = metric_values.map(function(mv) {
            let percent = 100*mv.active/mv.total;
            let index = metric_values.indexOf(mv);
            return [index+1, percent];
        });
        var seriesData = [{
            type: 'area',
            name: "Success Percentage",
            data: percentAreaData,
            borderWidth: 0,
            animation: false
        }];

        return seriesData;
    },
    render() {
        let image = this.props.image;
        let hasLoggedInUser = context.hasLoggedInUser();
        let graphDiv = (<div style={{"width":"135px", "height": "15px"}}></div>);
        let type = stores.ProfileStore.get().get("icon_set");
        let imageTags = stores.TagStore.getImageTags(image);
            imageTags = imageTags ? imageTags.first(10) : null;

        // Following code is used in the commented out visualization component:
        //
        // let staff_user = stores.ProfileStore.get().get("is_staff");
        // let imageMetric = this.props.metric;
        // let metric, labels, seriesData;

        // if(staff_user) {
        //     graphDiv = (<div style={{ "width": "135px", "height" : "15px"}}> {"No Metrics Available"} </div>);
        //     if(imageMetric != null) {
        //         metric = imageMetric.get('metrics');
        //         if (metric) {
        //             seriesData = this.getChartData(image, metric);
        //             labels = this.getLabels(metric);
        //             if (labels.length > 0) {
        //                 graphDiv = (<SparklineGraph
        //                                 seriesData={seriesData}
        //                                 categories={labels}
        //                                 title={""}
        //                             />);
        //             }
        //         }
        //     }
        // }
        let imageCreationDate = moment(image.get("start_date"))
                .tz(globals.TZ_REGION)
                .format("MMM Do YY hh:mm ");

        let converter = new Showdown.Converter();

        let description = image.get("description");
        if (!description) {
            description = "No Description Provided."
        } else if ( description.length > 90 ) {
            description = description.substring(0,90) + " ..."
        }

        let name = image.get('name');
        if (name.length > 30) {
            name = name.substring(0,30) + " ..."
        }

        let descriptionHtml = converter.makeHtml( description );
        let iconSize = 40;
        let icon;

        // always use the Gravatar icons
        icon = (
            <Gravatar hash={image.get("uuid_hash")} size={iconSize} type={type} />
        );

        // Hide bookmarking on the public page
        var bookmark;
        if (hasLoggedInUser) {
            bookmark = (
                <span
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                    }}
                >
                    <Bookmark width="15px" image={image} />
                </span>
            );
        }

        return (
            <MediaCard
                avatar={ icon }
                title={ name }
                onCardClick={ this.onCardClick }
                subheading={
                    <span>
                        <time>
                            { imageCreationDate }
                        </time>
                        by
                        <strong> { image.get("created_by").username }</strong>
                    </span>
                }
                summary={
                    <span>
                        { this.renderEndDated() }
                        { bookmark }
                        <span dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        <Tags activeTags={imageTags}/>
                        { graphDiv }
                    </span>
                }
            />
        );
    }
});

export default withRouter(ImageListCard);
