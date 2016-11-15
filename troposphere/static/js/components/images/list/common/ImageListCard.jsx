import React from "react";
import Router from "react-router";
import RouterInstance from "Router";
import Gravatar from "components/common/Gravatar";
import MediaCard from "components/common/ui/MediaCard";
import Backbone from "backbone";
import Bookmark from "components/images/common/Bookmark";
import Tags from "components/images/detail/tags/Tags";
import Showdown from "showdown";
import context from "context";
import globals from "globals";
import moment from "moment";
import stores from "stores";


export default React.createClass({
    displayName: "ImageListCard",

    mixins: [Router.State],

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onCardClick() {
        RouterInstance.getInstance()
            .transitionTo("image-details",{
                imageId: this.props.image.id
            });
    },

    renderEndDated() {
        let style = {
            position: "absolute",
            top: "3px",
            left: "0",
            background: "#F55A5A",
            display: "inline-block",
            padding: "3px 5px",
            color: "white",
            fontSize: "10px",
        };

        if (this.props.isEndDated) {
            return (
                <div style={ style }>
                    End Dated
                </div>
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
