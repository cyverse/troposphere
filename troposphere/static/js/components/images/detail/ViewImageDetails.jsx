import React from "react";
import Backbone from "backbone";

import TagsView from "./tags/TagsView";
import CreatedView from "./created/CreatedView";
import RemovedView from "./removed/RemovedView";
import AuthorView from "./author/AuthorView";
import DescriptionView from "./description/DescriptionView";
import VisibilityView from "./visibility/VisibilityView";
import Gravatar from "components/common/Gravatar";
import Ribbon from "components/common/Ribbon";

import stores from "stores";


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

    renderEndDated: function() {
        let { image } = this.props;

        if (image.isEndDated()) {
            let ribbon = {
                top: "-6px",
                left: "-9px",
                padding: "3px 7px",
                fontSize: "11px",
            };

            return (
            <Ribbon text={"End Dated"}
                    styleOverride={ ribbon }/>
            );
        }
    },

    render: function() {
        let { image, tags } = this.props,
            type = stores.ProfileStore.get().get("icon_set");

        let style = {
            wrapper: {
                position: "relative",
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
                        hash={ image.get("uuid_hash") }
                        size={ 50 } type={ type }/>
                    { this.renderEndDated() }
                </div>
                <div>
                    <div style={ style.details }>
                        <CreatedView image={ image } />
                        <RemovedView image={ image } />
                        <AuthorView image={ image } />
                        <DescriptionView image={ image } />
                        <VisibilityView image={ image } />
                        <TagsView image={ image } tags={ tags } />
                    </div>
                    { this.renderEditLink() }
                </div>
            </div>
        );
    }
});
