import React from "react";
import { withRouter } from "react-router";
import Showdown from "showdown";
import Backbone from "backbone";
import moment from "moment";

import Gravatar from "components/common/Gravatar";
import MediaCard from "components/common/ui/MediaCard";
import Bookmark from "components/images/common/Bookmark";
import Tags from "components/images/detail/tags/Tags";
import context from "context";
import globals from "globals";
import stores from "stores";
import Ribbon from "components/common/Ribbon";


const ImageListCard = React.createClass({
    displayName: "ImageListCard",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
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

    render() {
        let image = this.props.image;
        let hasLoggedInUser = context.hasLoggedInUser();
        let type = stores.ProfileStore.get().get("icon_set");
        let imageTags = stores.TagStore.getImageTags(image);
            imageTags = imageTags ? imageTags.first(10) : null;

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
                    </span>
                }
            />
        );
    }
});

export default withRouter(ImageListCard);
