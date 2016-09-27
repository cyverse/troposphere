import React from "react";
import Router from "react-router";
import Gravatar from "components/common/Gravatar.react";
import Backbone from "backbone";
import Bookmark from "components/images/common/Bookmark.react";
import Tags from "components/images/detail/tags/Tags.react";
import Showdown from "showdown";
import context from "context";
import globals from "globals";
import moment from "moment";
import stores from "stores";


export default React.createClass({
    displayName: "ImageListCard",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var image = this.props.image,
            hasLoggedInUser = context.hasLoggedInUser(),
            type = stores.ProfileStore.get().get("icon_set"),
            imageTags = stores.TagStore.getImageTags(image),
            imageCreationDate = moment(image.get("start_date"))
                .tz(globals.TZ_REGION)
                .format("MMM Do YY hh:mm "),
            converter = new Showdown.Converter(),
            description = image.get("description");

        if (!description) {
            description = "No Description Provided."
        }
        var descriptionHtml = converter.makeHtml(description),
            iconSize = 40,
            icon;

        // always use the Gravatar icons
        icon = (
            <Gravatar hash={image.get("uuid_hash")} size={iconSize} type={type} />
        );

        // Hide bookmarking on the public page
        var bookmark;
        let endDated;
        if (this.props.isEndDated) {
            endDated = (
                <div 
                    style={{ 
                        position: "absolute", 
                        top: "10px", 
                        left: "0", 
                        background: "#F55A5A", 
                        display: "inline-block", 
                        padding: "5px 10px", 
                        color: "white" 
                    }}
                >
                    End Dated
                </div>
            );
        }
        if (hasLoggedInUser) {
            bookmark = (
                <Bookmark image={image} />
            );
        }

        return (
        <div className="media card">
            {endDated}
            <div className="media__img">
                <Router.Link to="image-details" params={{ imageId: image.id }}> 
                    {icon} 
                </Router.Link>
            </div>
            <div 
                className="media__content"
                style={{ display: "flex" }} 
            >
                <div 
                    className="media__title"
                    style={{ 
                        minWidth: "250px",
                        marginRight: "40px"
                    }}    
                >
                    <h2 className="t-body-2" >
                        <Router.Link to="image-details" params={{ imageId: image.id }}> 
                            {image.get("name")} 
                        </Router.Link>
                    </h2> 
                    <div style={{ fontSize: "12px" }}> 
                        <time> 
                            {imageCreationDate} 
                        </time> 
                        by 
                        <strong> {image.get("created_by").username}</strong> 
                    </div> 
                </div>
                <div className="description">
                    <span dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                    <Tags activeTags={imageTags}/>
                </div>
            </div>
            {bookmark}
        </div>
        );
    }
});
