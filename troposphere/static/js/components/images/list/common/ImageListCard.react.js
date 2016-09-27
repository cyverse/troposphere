import React from "react";
import Router from "react-router";
import RouterInstance from "Router";
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

    render() {
        var image = this.props.image,
            hasLoggedInUser = context.hasLoggedInUser(),
            type = stores.ProfileStore.get().get("icon_set"),
            imageTags = stores.TagStore.getImageTags(image),
            imageCreationDate = moment(image.get("start_date"))
                .tz(globals.TZ_REGION)
                .format("MMM Do YY hh:mm "),
            converter = new Showdown.Converter(),
            description = image.get("description");
            name = image.get('name');

        if (imageTags.length > 10) {
            imageTags = imageTags.slice(0,10);
        }
        if (name.length > 30) {
            name = name.substring(0,30) + " ..."
        }
        if (!description) {
            description = "No Description Provided."
        } else if ( description.length > 90 ) {
            description = description.substring(0,90) + " ..."
        }
        var descriptionHtml = converter.makeHtml( description ),
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
            <div 
                onClick={ this.onCardClick } 
                className="media card"
                style={{
                    cursor: "pointer"
                }}
            >
                {endDated}
                <div className="media__img">
                    {icon} 
                </div>
                <div 
                    className="media__content"
                    style={{ 
                        display: "flex", 
                        flexFlow: "wrap",
                    }} 
                >
                    <div 
                        className="media__title"
                        style={{ 
                            minWidth: "220px",
                            marginRight: "40px"
                        }}    
                    >
                        <h2 className="t-body-2" >
                            { name }  
                        </h2> 
                        <div style={{ fontSize: "12px" }}> 
                            <time> 
                                {imageCreationDate} 
                            </time> 
                            by 
                            <strong> {image.get("created_by").username}</strong> 
                        </div> 
                    </div>
                    <div className="description"
                        style={{
                            minWidth: "250px"
                        }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        <Tags activeTags={imageTags}/>
                    </div>
                </div>
                {bookmark}
            </div>
        );
    }
});
