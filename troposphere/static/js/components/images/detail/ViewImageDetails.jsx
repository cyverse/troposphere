import React from "react";
import Backbone from "backbone";
import TagsView from "./tags/TagsView";
import CreatedView from "./created/CreatedView";
import RemovedView from "./removed/RemovedView";
import AuthorView from "./author/AuthorView";
import DescriptionView from "./description/DescriptionView";
import stores from "stores";
import Gravatar from "components/common/Gravatar";

export default React.createClass({
    displayName: "ViewImageDetails",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection),
        identities: React.PropTypes.instanceOf(Backbone.Collection),
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onEditImageDetails: React.PropTypes.func.isRequired
    },

    renderEditLink: function() {
        var profile = stores.ProfileStore.get(),
            image = this.props.image;

        if (profile.id
            && profile.get("username") === image.get("created_by").username
            || profile.get("is_staff")) {
            return (
                <div>
                    <a
                        onClick={this.props.onEditImageDetails}
                    >
                        <span className="glyphicon glyphicon-pencil"/>
                           {" Edit details"}
                        </a>
                </div>
            )
        }
    },

    render: function() {
        let { image, tags } = this.props;
        let type = stores.ProfileStore.get().get("icon_set");
        let style = {
            wrapper: {
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "80px",
            },
            img: {
                borderRadius: "999px",
                overflow: "hidden",
                marginRight: "20px",
                minWidth: "50px",
            },
            details: {
                marginBottom: "20px",
                minWidth: "600px",
            }
        };

        return (
            <div style={ style.wrapper }>
                <div style={ style.img }>
                    <Gravatar 
                        hash={image.get("uuid_hash")} 
                        size={ 50 } type={type} 
                    />
                </div>
                <div>
                    <div style={ style.details }>
                        <CreatedView image={ image } />
                        <RemovedView image={ image } />
                        <AuthorView image={ image } />
                        <DescriptionView image={ image } />
                        <TagsView image={ image } tags={ tags } />
                    </div>
                    {this.renderEditLink()}
                </div>
            </div>
        );
    }
});
